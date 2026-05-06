import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrewService } from '../crew/crew.service';
import { CreateTrainingFlightDto } from './dto/create-training-flight.dto';

// ─── Вспомогательная функция: считает минуты между взлётом и посадкой ────────
function calcTotalMinutes(
  takeoffDate: string,
  takeoffTime: string,
  landingDate: string,
  landingTime: string,
): number {
  const dep = new Date(`${takeoffDate}T${takeoffTime}:00Z`);
  const arr = new Date(`${landingDate}T${landingTime}:00Z`);
  const diff = arr.getTime() - dep.getTime();
  return diff > 0 ? Math.round(diff / 60000) : 0;
}

@Injectable()
export class TrainingFlightService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crewService: CrewService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.trainingFlight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const flight = await this.prisma.trainingFlight.findFirst({
      where: { id, userId },
    });
    if (!flight) throw new NotFoundException('Запись не найдена');
    return flight;
  }

  async create(userId: string, dto: CreateTrainingFlightDto) {
    const totalTime = calcTotalMinutes(
      dto.takeoffDate,
      dto.takeoffTime,
      dto.landingDate,
      dto.landingTime,
    );

    const flight = await this.prisma.trainingFlight.create({
      data: {
        userId,
        flightNumber:    dto.flightNumber,
        callSign:        dto.callSign,
        acType:          dto.acType,
        acReg:           dto.acReg,
        timeOfDay:       dto.timeOfDay       ?? 'DAY',
        leftSeatCrewId:  dto.leftSeatCrewId  ?? null,
        leftSeatPos:     dto.leftSeatPos     ?? 'КВС',
        leftSeatName:    dto.leftSeatName    ?? '',
        rightSeatCrewId: dto.rightSeatCrewId ?? null,
        rightSeatPos:    dto.rightSeatPos    ?? 'ВП',
        rightSeatName:   dto.rightSeatName   ?? '',
        landingSeatPos:  dto.landingSeatPos  ?? null,
        attendantIds:    dto.attendantIds    ?? [],
        engineerIds:     dto.engineerIds     ?? [],
        technicianIds:   dto.technicianIds   ?? [],
        mechanicIds:     dto.mechanicIds     ?? [],
        attendantNames:  dto.attendantNames  ?? [],
        engineerNames:   dto.engineerNames   ?? [],
        technicianNames: dto.technicianNames ?? [],
        mechanicNames:   dto.mechanicNames   ?? [],
        exerciseNumber:  dto.exerciseNumber  ?? null,
        takeoffDate:     dto.takeoffDate,
        takeoffTime:     dto.takeoffTime,
        landingDate:     dto.landingDate,
        landingTime:     dto.landingTime,
        totalTime,
        closedCabinTime: dto.closedCabinTime ?? 0,
        smuTotal:        dto.smuTotal        ?? 0,
        smuClouds:       dto.smuClouds       ?? 0,
        altMax:          dto.altMax          ?? null,
        altMin:          dto.altMin          ?? null,
        visibility:      dto.visibility      ?? null,
        cloudiness:      dto.cloudiness      ?? null,
        cloudTop:        dto.cloudTop        ?? null,
        cloudBase:       dto.cloudBase       ?? null,
        takeoffMinimum:  dto.takeoffMinimum  ?? false,
        approachRmsA:    dto.approachRmsA    ?? false,
        approachRmsD:    dto.approachRmsD    ?? false,
        approachRmsR:    dto.approachRmsR    ?? false,
        approachViz:     dto.approachViz     ?? false,
        approachCount:   dto.approachCount   ?? 0,
        landingsCount:   dto.landingsCount   ?? 0,
        remarks:         dto.remarks         ?? null,
      },
    });

    // ✅ Обновляем налёт всех членов экипажа
    await this.updateCrewHours(dto, totalTime);

    return flight;
  }

  async update(id: string, userId: string, dto: Partial<CreateTrainingFlightDto>) {
    const old = await this.findOne(id, userId);

    // Вычитаем старый налёт
    await this.updateCrewHours(old as any, -old.totalTime);

    const newTotal = calcTotalMinutes(
      dto.takeoffDate ?? old.takeoffDate,
      dto.takeoffTime ?? old.takeoffTime,
      dto.landingDate ?? old.landingDate,
      dto.landingTime ?? old.landingTime,
    );

    const data: Record<string, any> = { ...dto, totalTime: newTotal };

    const updated = await this.prisma.trainingFlight.update({
      where: { id },
      data,
    });

    // Прибавляем новый налёт
    await this.updateCrewHours(updated as any, newTotal);

    return updated;
  }

  async remove(id: string, userId: string) {
    const flight = await this.findOne(id, userId);

    // Вычитаем налёт при удалении
    await this.updateCrewHours(flight as any, -flight.totalTime);

    return this.prisma.trainingFlight.delete({ where: { id } });
  }

  // ─── Обновление налёта всех членов экипажа ───────────────────────────────
  private async updateCrewHours(
    dto: {
      leftSeatCrewId?:  string | null;
      rightSeatCrewId?: string | null;
      attendantIds?:    string[];
      engineerIds?:     string[];
      technicianIds?:   string[];
      mechanicIds?:     string[];
      landingsCount?:   number;
    },
    totalMinutes: number,
  ) {
    if (totalMinutes === 0) return;

    const totalHours = totalMinutes / 60;
    const landings   = dto.landingsCount ?? 0;
    const updates: Promise<any>[] = [];

    if (dto.leftSeatCrewId) {
      updates.push(
        this.crewService.addFlightHours(dto.leftSeatCrewId, {
          totalFlightHours: totalHours,
          totalPicHours:    totalHours, // КВС/ЛИ — командирский налёт
          totalLandings:    landings,
        }),
      );
    }

    if (dto.rightSeatCrewId) {
      updates.push(
        this.crewService.addFlightHours(dto.rightSeatCrewId, {
          totalFlightHours: totalHours,
          totalSicHours:    totalHours, // ВП — налёт второго пилота
          totalLandings:    landings,
        }),
      );
    }

    const otherIds = [
      ...(dto.attendantIds  ?? []),
      ...(dto.engineerIds   ?? []),
      ...(dto.technicianIds ?? []),
      ...(dto.mechanicIds   ?? []),
    ];

    for (const crewId of otherIds) {
      updates.push(
        this.crewService.addFlightHours(crewId, {
          totalFlightHours: totalHours,
          totalLandings:    landings,
        }),
      );
    }

    await Promise.all(updates);
  }
}
