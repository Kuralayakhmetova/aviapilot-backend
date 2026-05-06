import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; // ← добавь импорт
import { CrewMember } from './entities/crew-member.entity';
import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrewMember]),
    PassportModule, // ← добавь сюда
  ],
  controllers: [CrewController],
  providers: [CrewService],
  exports: [CrewService],
})
export class CrewModule {}