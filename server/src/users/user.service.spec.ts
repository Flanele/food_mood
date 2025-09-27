import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DbService } from 'src/db/db.service';
import { UserProfileService } from './user-profile.service';

const dbMock = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const profileMock = {
  create: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DbService, useValue: dbMock },
        { provide: UserProfileService, useValue: profileMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail() delegates to db.user.findFirst', async () => {
    const user = { id: 1, email: 'a@b.c' };
    dbMock.user.findFirst.mockResolvedValue(user);

    const result = await service.findByEmail('a@b.c');

    expect(dbMock.user.findFirst).toHaveBeenCalledWith({ where: { email: 'a@b.c' } });
    expect(result).toBe(user);
  });

  it('findByID() delegates to db.user.findFirst', async () => {
    const user = { id: 42, email: 'x@y.z' };
    dbMock.user.findFirst.mockResolvedValue(user);

    const result = await service.findByID(42);

    expect(dbMock.user.findFirst).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(result).toBe(user);
  });

  it('create() creates user and profile', async () => {
    const created = { id: 10, email: 'new@user.io', passwordHash: 'hash' };
    dbMock.user.create.mockResolvedValue(created);
    profileMock.create.mockResolvedValue({ id: 100, userId: 10 });

    const result = await service.create('new@user.io', 'hash');

    expect(dbMock.user.create).toHaveBeenCalledWith({
      data: { email: 'new@user.io', passwordHash: 'hash' },
    });
    expect(profileMock.create).toHaveBeenCalledWith(10);
    expect(result).toBe(created);
  });

  it('create() bubbles up error if profile create fails', async () => {
    dbMock.user.create.mockResolvedValue({ id: 10, email: 'a@b.c' });
    profileMock.create.mockRejectedValue(new Error('profile failed'));

    await expect(service.create('a@b.c')).rejects.toThrow('profile failed');
  });
});
