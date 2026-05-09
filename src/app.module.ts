import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LogbookModule } from './logbook/logbook.module';
import { ChronometryModule } from './chronometry/chronometry.module';
import { CrewModule } from './crew/crew.module';


import { TrainingFlightModule } from './training-flight/training-flight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ forRoot — подключение к БД
   

    PrismaModule,
    AuthModule,
    UsersModule,
    LogbookModule,
    ChronometryModule,
    CrewModule,
    TrainingFlightModule,


  ],
  providers: [
   
  ],
}) 
export class AppModule {}