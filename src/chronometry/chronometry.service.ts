import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChronoDayLogDto } from "./dto/chronometry.dto";

@Injectable()
export class ChronometryService {
  constructor(private prisma: PrismaService) {}

  // Получить все логи пользователя
  async getAll(userId: string) {
    const logs = await this.prisma.chronoDayLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { rows: { orderBy: { num: "asc" } } },
    });

    // Возвращаем в формате фронтенда (id строк из БД как id)
    return logs.map((l) => ({
      id: l.id,
      date: l.date,
      unit: l.unit,
      rows: l.rows.map((r) => ({
        id: r.id,
        num: r.num,
        acType: r.acType,
        acReg: r.acReg,
        commanderNum: r.commanderNum,
        commander: r.commander,
        crew: r.crew,
        exerciseNum: r.exerciseNum,
        takeoffH: r.takeoffH, takeoffM: r.takeoffM,
        landingH: r.landingH, landingM: r.landingM,
        flightH: r.flightH, flightM: r.flightM,
        kmzTotalH: r.kmzTotalH, kmzTotalM: r.kmzTotalM,
        kmzCloudsH: r.kmzCloudsH, kmzCloudsM: r.kmzCloudsM,
        landingsCount: r.landingsCount,
        touchdownCount: r.touchdownCount,
        closedCabinH: r.closedCabinH, closedCabinM: r.closedCabinM,
        weather: r.weather,
      })),
    }));
  }

  // Сохранить всё (bulk upsert) — вызывается кнопкой "Сақтау"
  async saveAll(userId: string, logs: ChronoDayLogDto[]) {
    // Получаем текущие ID логов в БД
    const existingLogs = await this.prisma.chronoDayLog.findMany({
      where: { userId },
      select: { id: true },
    });
    const existingIds = existingLogs.map((l) => l.id);
    const incomingIds = logs.filter((l) => l.id && existingIds.includes(l.id)).map((l) => l.id!);

    // Удаляем логи которых больше нет
    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (toDelete.length) {
      await this.prisma.chronoDayLog.deleteMany({ where: { id: { in: toDelete } } });
    }

    // Upsert каждого дня
    const results = await Promise.all(
      logs.map(async (log) => {
        const isExisting = log.id && existingIds.includes(log.id);

        if (isExisting && log.id) {
          // Удаляем старые строки и вставляем новые
          await this.prisma.chronoDayLog.update({
            where: { id: log.id },
            data: { date: log.date, unit: log.unit ?? "ККМЖ" },
          });
          await this.prisma.chronoRow.deleteMany({ where: { dayLogId: log.id } });
          await this.prisma.chronoRow.createMany({
            data: log.rows.map((r) => ({
              dayLogId: log.id!,
              num: r.num,
              acType: r.acType ?? "",
              acReg: r.acReg ?? "",
              commanderNum: r.commanderNum ?? "",
              commander: r.commander ?? "",
              crew: r.crew ?? "",
              exerciseNum: r.exerciseNum ?? "",
              takeoffH: r.takeoffH ?? "", takeoffM: r.takeoffM ?? "",
              landingH: r.landingH ?? "", landingM: r.landingM ?? "",
              flightH: r.flightH ?? "", flightM: r.flightM ?? "",
              kmzTotalH: r.kmzTotalH ?? "-", kmzTotalM: r.kmzTotalM ?? "-",
              kmzCloudsH: r.kmzCloudsH ?? "-", kmzCloudsM: r.kmzCloudsM ?? "-",
              landingsCount: r.landingsCount ?? "1",
              touchdownCount: r.touchdownCount ?? "1",
              closedCabinH: r.closedCabinH ?? "-", closedCabinM: r.closedCabinM ?? "-",
              weather: r.weather ?? "-/-",
            })),
          });
          return log.id;
        } else {
          // Создаём новый лог
          const created = await this.prisma.chronoDayLog.create({
            data: {
              userId,
              date: log.date,
              unit: log.unit ?? "ККМЖ",
              rows: {
                createMany: {
                  data: log.rows.map((r) => ({
                    num: r.num,
                    acType: r.acType ?? "",
                    acReg: r.acReg ?? "",
                    commanderNum: r.commanderNum ?? "",
                    commander: r.commander ?? "",
                    crew: r.crew ?? "",
                    exerciseNum: r.exerciseNum ?? "",
                    takeoffH: r.takeoffH ?? "", takeoffM: r.takeoffM ?? "",
                    landingH: r.landingH ?? "", landingM: r.landingM ?? "",
                    flightH: r.flightH ?? "", flightM: r.flightM ?? "",
                    kmzTotalH: r.kmzTotalH ?? "-", kmzTotalM: r.kmzTotalM ?? "-",
                    kmzCloudsH: r.kmzCloudsH ?? "-", kmzCloudsM: r.kmzCloudsM ?? "-",
                    landingsCount: r.landingsCount ?? "1",
                    touchdownCount: r.touchdownCount ?? "1",
                    closedCabinH: r.closedCabinH ?? "-", closedCabinM: r.closedCabinM ?? "-",
                    weather: r.weather ?? "-/-",
                  })),
                },
              },
            },
          });
          return created.id;
        }
      })
    );

    return { saved: results.length };
  }
}
