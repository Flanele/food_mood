import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UserProfileService } from './user-profile.service';

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    private userProfileService: UserProfileService,
  ) {}

  findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }

  findByID(userId: number) {
    return this.db.user.findFirst({ where: { id: userId } });
  }

  async create(email: string, passwordHash?: string) {
    const user = await this.db.user.create({ data: { email, passwordHash } });

    await this.userProfileService.create(user.id);

    return user;
  }
}
