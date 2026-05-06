import { Module } from '@nestjs/common';
import { TrainingFlightController } from './training-flight.controller';
import { TrainingFlightService } from './training-flight.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CrewModule } from '../crew/crew.module';

@Module({
  imports: [PrismaModule, CrewModule],
  controllers: [TrainingFlightController],
  providers: [TrainingFlightService],
})
export class TrainingFlightModule {}
