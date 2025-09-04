import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ServersModule } from './servers/servers.module';
import { SitesModule } from './sites/sites.module';
import { DatabasesModule } from './databases/databases.module';
import { BackupsModule } from './backups/backups.module';
import { BillingModule } from './billing/billing.module';
import { SupportModule } from './support/support.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { LicensingModule } from './licensing/licensing.module';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ServersModule,
    SitesModule,
    DatabasesModule,
    BackupsModule,
    BillingModule,
    SupportModule,
    KnowledgeBaseModule,
    LicensingModule,
    EmailModule,
    MetricsModule,
  ],
})
export class AppModule {}
