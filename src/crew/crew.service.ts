import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CrewMember } from './entities/crew-member.entity';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

export interface CrewFilter {
  search?:   string;
  category?: string;
  status?:   string;
  sortBy?:   string;
  order?:    'ASC' | 'DESC';
  page?:     number;
  limit?:    number;
}

export interface FlightHoursDelta {
  totalFlightHours?: number;
  totalPicHours?:    number;
  totalSicHours?:    number;
  totalNightHours?:  number;
  totalIfrHours?:    number;
  totalLandings?:    number;
}

@Injectable()
export class CrewService {
  constructor(
    @InjectRepository(CrewMember)
    private readonly crewRepository: Repository<CrewMember>,
  ) {}

  async findAll(filter: CrewFilter = {}): Promise<{ data: CrewMember[]; total: number }> {
    const {
      search,
      category,
      status,
      sortBy  = 'lastName',
      order   = 'ASC',
      page    = 1,
      limit   = 20,
    } = filter;

    const where: FindOptionsWhere<CrewMember>[] = [];
    const baseCondition: FindOptionsWhere<CrewMember> = {};

    if (category) baseCondition.category = category as CrewMember['category'];
    if (status === 'active')   baseCondition.isActive = true;
    if (status === 'inactive') baseCondition.isActive = false;

    if (search) {
      const searchPattern = `%${search}%`;
      const searchFields = ['firstName', 'lastName', 'email'] as const;
      for (const field of searchFields) {
        where.push({ ...baseCondition, [field]: Like(searchPattern) });
      }
    } else {
      where.push(baseCondition);
    }

    const allowedSortFields = ['lastName', 'firstName', 'totalFlightHours', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'lastName';

    const [data, total] = await this.crewRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: { [safeSortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: number | string): Promise<CrewMember> {
    const member = await this.crewRepository.findOne({ where: { id } as any });
    if (!member) throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    return member;
  }

  async create(dto: CreateCrewDto): Promise<CrewMember> {
    const member = this.crewRepository.create(dto);
    return this.crewRepository.save(member);
  }

  async update(id: number, dto: UpdateCrewDto): Promise<CrewMember> {
    await this.findOne(id);
    await this.crewRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.crewRepository.remove(member);
  }

  // ✅ Прибавляет (или вычитает при отрицательных значениях) налёт сотрудника
  async addFlightHours(crewId: string, delta: FlightHoursDelta): Promise<void> {
    const member = await this.crewRepository.findOne({ where: { id: crewId } as any });
    if (!member) return; // Молча игнорируем если сотрудник не найден

    await this.crewRepository
      .createQueryBuilder()
      .update(CrewMember)
      .set({
        totalFlightHours: () => `"totalFlightHours" + ${delta.totalFlightHours ?? 0}`,
        totalPicHours:    () => `"totalPicHours"    + ${delta.totalPicHours    ?? 0}`,
        totalSicHours:    () => `"totalSicHours"    + ${delta.totalSicHours    ?? 0}`,
        totalNightHours:  () => `"totalNightHours"  + ${delta.totalNightHours  ?? 0}`,
        totalIfrHours:    () => `"totalIfrHours"    + ${delta.totalIfrHours    ?? 0}`,
        totalLandings:    () => `"totalLandings"    + ${delta.totalLandings    ?? 0}`,
      })
      .where('id = :id', { id: crewId })
      .execute();
  }
}
