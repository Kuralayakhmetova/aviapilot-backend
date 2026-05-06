import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrewService } from '../crew/crew.service';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';

@Injectable()
export class LogbookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crewService: CrewService,
  ) {}

  // ─── GET all ────────────────────────────────────────────────────────────────
  async findAll(userId: string) {
    return this.prisma.logbookEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  // ─── GET one ────────────────────────────────────────────────────────────────
  async findOne(id: string, userId: string) {
    const entry = await this.prisma.logbookEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) throw new NotFoundException('Запись не найдена');
    return entry;
  }

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(userId: string, dto: CreateLogbookEntryDto) {
    const entry = await this.prisma.logbookEntry.create({
      data: {
        userId,
        ...dto,
        date: new Date(dto.date),
        arrDate: dto.arrDate ? new Date(dto.arrDate) : undefined,
        flightAttendants: dto.flightAttendants ?? [],
        engineers:        dto.engineers        ?? [],
        technicians:      dto.technicians      ?? [],
        mechanics:        dto.mechanics        ?? [],
        leftSeatCrewId:  (dto as any).leftSeatCrewId  ?? null,
        rightSeatCrewId: (dto as any).rightSeatCrewId ?? null,
        // ✅ Приводим к строкам
        attendantIds:    ((dto as any).attendantIds  ?? []).map(String),
        engineerIds:     ((dto as any).engineerIds   ?? []).map(String),
        technicianIds:   ((dto as any).technicianIds ?? []).map(String),
        status:       dto.status      ?? 'COMPLETED',
        crossCountry: dto.crossCountry ?? false,
      },
    });

    await this.updateCrewHours({
      leftSeatCrewId:  (dto as any).leftSeatCrewId  ?? null,
      rightSeatCrewId: (dto as any).rightSeatCrewId ?? null,
      attendantIds:    ((dto as any).attendantIds  ?? []).map(String),
      engineerIds:     ((dto as any).engineerIds   ?? []).map(String),
      technicianIds:   ((dto as any).technicianIds ?? []).map(String),
      totalTime:  dto.totalTime,
      picTime:    dto.picTime,
      sicTime:    dto.sicTime,
      nightTime:  dto.nightTime,
      ifrTime:    dto.ifrTime,
      landingsDay:   dto.landingsDay,
      landingsNight: dto.landingsNight,
    });

    return entry;
  }

  // ─── UPDATE ─────────────────────────────────────────────────────────────────
  async update(id: string, userId: string, dto: Partial<CreateLogbookEntryDto>) {
    const old = await this.findOne(id, userId);

    // Вычитаем старый налёт
    await this.updateCrewHours({
      leftSeatCrewId:  (old as any).leftSeatCrewId,
      rightSeatCrewId: (old as any).rightSeatCrewId,
      attendantIds:    ((old as any).attendantIds  ?? []).map(String),
      engineerIds:     ((old as any).engineerIds   ?? []).map(String),
      technicianIds:   ((old as any).technicianIds ?? []).map(String),
      totalTime:  (old as any).totalTime,
      picTime:    (old as any).picTime,
      sicTime:    (old as any).sicTime,
      nightTime:  (old as any).nightTime,
      ifrTime:    (old as any).ifrTime,
      landingsDay:   (old as any).landingsDay,
      landingsNight: (old as any).landingsNight,
    }, true);

    const data: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) data[key] = value;
    }

    // ✅ Конвертируем date в Date объект если это строка
    if (dto.date) {
      data.date = typeof dto.date === 'string' ? new Date(dto.date) : dto.date;
    }

    // ✅ Конвертируем arrDate в Date объект если это строка
    if (dto.arrDate !== undefined) {
      data.arrDate = dto.arrDate 
        ? (typeof dto.arrDate === 'string' ? new Date(dto.arrDate) : dto.arrDate)
        : null;
    }

    // ✅ Приводим crew IDs к строкам при обновлении
    if ((dto as any).attendantIds)  data.attendantIds  = ((dto as any).attendantIds  ?? []).map(String);
    if ((dto as any).engineerIds)   data.engineerIds   = ((dto as any).engineerIds   ?? []).map(String);
    if ((dto as any).technicianIds) data.technicianIds = ((dto as any).technicianIds ?? []).map(String);

    // ✅ Удаляем undefined значения
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const updated = await this.prisma.logbookEntry.update({ 
      where: { id }, 
      data 
    });

    // Прибавляем новый налёт
    await this.updateCrewHours({
      leftSeatCrewId:  (updated as any).leftSeatCrewId,
      rightSeatCrewId: (updated as any).rightSeatCrewId,
      attendantIds:    ((updated as any).attendantIds  ?? []).map(String),
      engineerIds:     ((updated as any).engineerIds   ?? []).map(String),
      technicianIds:   ((updated as any).technicianIds ?? []).map(String),
      totalTime:  (updated as any).totalTime,
      picTime:    (updated as any).picTime,
      sicTime:    (updated as any).sicTime,
      nightTime:  (updated as any).nightTime,
      ifrTime:    (updated as any).ifrTime,
      landingsDay:   (updated as any).landingsDay,
      landingsNight: (updated as any).landingsNight,
    });

    return updated;
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const entry = await this.findOne(id, userId);

    // Вычитаем налёт при удалении записи
    await this.updateCrewHours(entry as any, true);

    return this.prisma.logbookEntry.delete({ where: { id } });
  }

  // ─── ОБНОВЛЕНИЕ НАЛЁТА ЭКИПАЖА ─────────────────────────────────────────────
  private async updateCrewHours(
    dto: {
      leftSeatCrewId?:  string | null;
      rightSeatCrewId?: string | null;
      attendantIds?:    string[];
      engineerIds?:     string[];
      technicianIds?:   string[];
      totalTime?:       number;
      picTime?:         number;
      sicTime?:         number;
      nightTime?:       number;
      ifrTime?:         number;
      landingsDay?:     number;
      landingsNight?:   number;
    },
    subtract = false,
  ) {
    const sign = subtract ? -1 : 1;

    const totalHours = ((dto.totalTime ?? 0) / 60) * sign;
    const picHours   = ((dto.picTime   ?? 0) / 60) * sign;
    const sicHours   = ((dto.sicTime   ?? 0) / 60) * sign;
    const nightHours = ((dto.nightTime ?? 0) / 60) * sign;
    const ifrHours   = ((dto.ifrTime   ?? 0) / 60) * sign;
    const landings   = ((dto.landingsDay ?? 0) + (dto.landingsNight ?? 0)) * sign;

    const updates: Promise<any>[] = [];

    // КВС / левое кресло
    if (dto.leftSeatCrewId) {
      updates.push(
        this.crewService.addFlightHours(dto.leftSeatCrewId, {
          totalFlightHours: totalHours,
          totalPicHours:    picHours,
          totalNightHours:  nightHours,
          totalIfrHours:    ifrHours,
          totalLandings:    landings,
        }),
      );
    }

    // ВП / правое кресло
    if (dto.rightSeatCrewId) {
      updates.push(
        this.crewService.addFlightHours(dto.rightSeatCrewId, {
          totalFlightHours: totalHours,
          totalSicHours:    sicHours,
          totalNightHours:  nightHours,
          totalIfrHours:    ifrHours,
          totalLandings:    landings,
        }),
      );
    }

    // Бортпроводники, инженеры, техники — только общий налёт
    const otherIds = [
      ...(dto.attendantIds  ?? []),
      ...(dto.engineerIds   ?? []),
      ...(dto.technicianIds ?? []),
    ];

    for (const crewId of otherIds) {
      updates.push(
        this.crewService.addFlightHours(crewId, {
          totalFlightHours: totalHours,
          totalNightHours:  nightHours,
          totalLandings:    landings,
        }),
      );
    }

    await Promise.all(updates);
  }
}
