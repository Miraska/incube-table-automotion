// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutomationsModule } from './automations/automations.module';

@Module({
  imports: [
    PrismaModule,
    AutomationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
