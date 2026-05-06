import { Module } from '@nestjs/common';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CrewModule } from '../crew/crew.module';

@Module({
  imports: [PrismaModule, CrewModule],
  controllers: [LogbookController],
  providers: [LogbookService],
})
export class LogbookModule {}
