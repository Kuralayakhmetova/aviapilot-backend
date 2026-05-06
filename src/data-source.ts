// src/data-source.ts
import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { CrewMember } from './crew/entities/crew-member.entity';

// Загружаем .env вручную
config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [CrewMember],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});