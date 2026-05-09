import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CrewCategory, CrewRank } from '@prisma/client';
import type { Prisma } from '@prisma/client';

@Injectable()
export class CrewService {
  constructor(private readonly prisma: PrismaService) {}

 
   // ───────────────────────── GET ALL ─────────────────────────
  async findAll(params: {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  const {
    search,
    category,
    status,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 20,
  } = params;

  const where: any = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: category as CrewCategory }),
    ...(status && { isActive: status === 'active' }),
  };

  const [data, total] = await Promise.all([
    this.prisma.crewMember.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.crewMember.count({ where }),
  ]);

  return { data, total, page, limit };
}

  // ───────────────────────── GET ONE ─────────────────────────
  async findOne(id: string) {
    const member = await this.prisma.crewMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Crew member ${id} not found`);
    }

    return member;
  }

  // ───────────────────────── CREATE ─────────────────────────
  async create(dto: CreateCrewDto) {
    return this.prisma.crewMember.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,

        phone: dto.phone ?? undefined,
        position: dto.position ?? '',

       category: dto.category ?? CrewCategory.COMMANDER,
        rank: dto.rank ?? CrewRank.LIEUTENANT,

        isActive: dto.isActive ?? true,

        totalFlightHours: dto.totalFlightHours ?? 0,
        totalPicHours: 0,
        totalSicHours: 0,
        totalNightHours: 0,
        totalIfrHours: 0,
        totalLandings: 0,

        acTypePrimary: dto.acTypePrimary ?? null,

        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : null,
      },
    });
  }

  // ───────────────────────── UPDATE ─────────────────────────
  async update(id: string, dto: UpdateCrewDto) {
    await this.findOne(id);

    return this.prisma.crewMember.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
      },
    });
  }

  // ───────────────────────── DELETE ─────────────────────────
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.crewMember.delete({
      where: { id },
    });
  }

  // ───────────────────────── HOURS UPDATE ─────────────────────────
  async addFlightHours(
    crewId: string,
    delta: {
      totalFlightHours?: number;
      totalPicHours?: number;
      totalSicHours?: number;
      totalNightHours?: number;
      totalIfrHours?: number;
      totalLandings?: number;
    },
  ) {
    return this.prisma.crewMember.update({
      where: { id: crewId },
      data: {
        totalFlightHours: {
          increment: delta.totalFlightHours ?? 0,
        },
        totalPicHours: {
          increment: delta.totalPicHours ?? 0,
        },
        totalSicHours: {
          increment: delta.totalSicHours ?? 0,
        },
        totalNightHours: {
          increment: delta.totalNightHours ?? 0,
        },
        totalIfrHours: {
          increment: delta.totalIfrHours ?? 0,
        },
        totalLandings: {
          increment: delta.totalLandings ?? 0,
        },
      },
    });
  }
}