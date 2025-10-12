import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserProfileService } from './user-profile.service';
import { PatchProfileDTO, ProfileDTO } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';

const profileSvcMock = {
  getProfile: jest.fn(),
  editProfile: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserProfileService, useValue: profileSvcMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMyProfile() returns profile by session.id', async () => {
    const session: GetSessionInfoDto = {
      id: 7,
      email: 'ahsj@g.com',
      iat: 10,
      exp: 10,
    };

    const profile: ProfileDTO = {
      id: 1,
      userId: 7,
      sex: 'female',
      birthDate: null,
      heightCm: null,
      weightKg: null,
      bmi: null,
      prefs: null,
    };

    profileSvcMock.getProfile.mockResolvedValue(profile);

    const result = await controller.getMyProfile(session);

    expect(profileSvcMock.getProfile).toHaveBeenCalledWith(7);
    expect(result).toBe(profile);
  });

  it('editProfile() calls service with session.id and dto', async () => {
    const session: GetSessionInfoDto = {
      id: 7,
      email: 'ahsj@g.com',
      iat: 10,
      exp: 10,
    };
    const dto: PatchProfileDTO = { heightCm: 170 };
    const updated: ProfileDTO = {
      id: 1,
      userId: 7,
      sex: null,
      birthDate: null,
      heightCm: 170,
      weightKg: null,
      bmi: 0,
      prefs: null,
    };
    profileSvcMock.editProfile.mockResolvedValue(updated);

    const result = await controller.editProfile(dto, session);

    expect(profileSvcMock.editProfile).toHaveBeenCalledWith(7, dto);
    expect(result).toBe(updated);
  });
});
