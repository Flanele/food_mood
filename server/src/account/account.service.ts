import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AccountService {
  constructor(private db: DbService) {}

  findByProviderAccount(provider: string, providerAccountId: string) {
    return this.db.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
    });
  }

  async create(userId: number, provider: string, providerAccountId: string) {
    return this.db.account.create({
      data: { userId, provider, providerAccountId },
    });
  }
}
