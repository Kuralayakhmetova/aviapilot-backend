import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/scripts/default-index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient;

  constructor() {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const adapter = new PrismaPg(pool);
    this.client = new PrismaClient({ adapter });
  }

  // Проксируем все обращения к client
  get user() { return this.client.user; }
  get pilotProfile() { return this.client.pilotProfile; }
  get crewMember() { return this.client.crewMember; }
  get logbookEntry() { return this.client.logbookEntry; }
  get document() { return this.client.document; }
  get flightPlan() { return this.client.flightPlan; }
  get weatherSnapshot() { return this.client.weatherSnapshot; }
  get chronoDayLog() { return this.client.chronoDayLog; }
  get chronoRow() { return this.client.chronoRow; }
  get trainingFlight() { return this.client.trainingFlight; }
  get aircraftType() { return this.client.aircraftType; }

  async onModuleInit() {
    await this.client.$connect();
    console.log('✅ Prisma connected');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}