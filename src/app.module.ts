import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LogbookModule } from './logbook/logbook.module';
import { ChronometryModule } from './chronometry/chronometry.module';
import { CrewModule } from './crew/crew.module';
import { CrewMember } from './crew/entities/crew-member.entity';

import { TrainingFlightModule } from './training-flight/training-flight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ forRoot — подключение к БД
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [CrewMember],
        synchronize: true, // миграции уже запущены
      }),
    }),

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