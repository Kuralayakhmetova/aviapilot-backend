import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';

@Module({
  imports: [
    PassportModule,
  ],
  controllers: [CrewController],
  providers: [CrewService],
  exports: [CrewService],
})
export class CrewModule {}