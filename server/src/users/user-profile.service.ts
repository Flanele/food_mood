import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { PatchProfileDTO } from './dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserProfileService {
  constructor(private db: DbService) {}

  async create(userId: number) {
    return this.db.userProfile.create({ data: { userId: userId } });
  }

  async getProfile(userId: number) {
    const profile = await this.db.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException({ type: 'profile-not-found' });
    return profile;
  }

  async editProfile(userId: number, dto: PatchProfileDTO) {
    const exists = await this.db.userProfile.findUnique({ where: { userId } });
    if (!exists) throw new BadRequestException({ type: 'profile-not-found' });

    // Формируем data ТОЛЬКО из присланных полей
    const data: Prisma.UserProfileUpdateInput = {};

    if (dto.sex !== undefined) data.sex = dto.sex;

    if (dto.birthDate !== undefined) {
      if (dto.birthDate === null) {
        data.birthDate = null;
      } else {
        const date = new Date(dto.birthDate);
        if (Number.isNaN(date.getTime())) {
          throw new BadRequestException({ type: 'bad-birthDate' });
        }
        data.birthDate = date;
      }
    }

    if (dto.heightCm !== undefined) data.heightCm = dto.heightCm;
    if (dto.weightKg !== undefined) data.weightKg = dto.weightKg;

    if (dto.prefs !== undefined) {
      data.prefs =
        dto.prefs === null ? null : JSON.parse(JSON.stringify(dto.prefs));
    }

    // Автопересчёт BMI — только если менялся рост или вес
    if (dto.heightCm !== undefined || dto.weightKg !== undefined) {
      const height =
        dto.heightCm !== undefined ? dto.heightCm : exists.heightCm;
      const weight =
        dto.weightKg !== undefined ? dto.weightKg : exists.weightKg;

      data.bmi =
        height && weight
          ? Number((weight / (height / 100) ** 2).toFixed(1))
          : null;
    }

    return this.db.userProfile.update({ where: { userId }, data });
  }

  returnAllProfiles(
    where: Prisma.UserProfileWhereInput = {},
    select: Prisma.UserProfileSelect = {},
  ) {
    return this.db.userProfile.findMany({ where, select });
  }
}
