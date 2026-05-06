import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum CrewCategory {
  COMMANDER        = 'COMMANDER',
  SECOND_PILOT     = 'SECOND_PILOT',
  INSTRUCTOR       = 'INSTRUCTOR',
  ENGINEER         = 'ENGINEER',
  TECHNICIAN       = 'TECHNICIAN',
  MECHANIC         = 'MECHANIC',
  FLIGHT_ATTENDANT = 'FLIGHT_ATTENDANT',
}

export enum CrewRank {
  LIEUTENANT        = 'Лейтенант',
  SENIOR_LIEUTENANT = 'Старший лейтенант',
  CAPTAIN           = 'Капитан',
  MAJOR             = 'Майор',
  LIEUTENANT_COLONEL = 'Подполковник',
  COLONEL           = 'Полковник',
}

@Entity('crew_members')
export class CrewMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  position?: string;

  @Column({
    type: 'enum',
    enum: CrewCategory,
    default: CrewCategory.COMMANDER,
  })
  category: CrewCategory;

  // ✅ isActive вместо status enum — как на фронтенде
  @Column({ default: true })
  isActive: boolean;

  // ✅ rank — воинское звание
  @Column({
    type: 'enum',
    enum: CrewRank,
    nullable: true,
  })
  rank: CrewRank;

  // ✅ totalFlightHours — как на фронтенде
  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  totalFlightHours: number;

  // ✅ totalPicHours — как на фронтенде
  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  totalPicHours: number;

  // ✅ totalSicHours — как на фронтенде
  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  totalSicHours: number;

  // ✅ totalNightHours — как на фронтенде
  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  totalNightHours: number;

  // ✅ totalIfrHours — как на фронтенде    // ✅ totalIfrHours — как на фронтенде
  @Column({ type: 'decimal', precision: 8, scale: 1, default: 0 })
  totalIfrHours: number;

  // ✅ totalLandings — как на фронтенде
  @Column({ type: 'int', default: 0 })
  totalLandings: number;

  // ✅ acTypePrimary — как на фронтенде
  @Column({ nullable: true })
  acTypePrimary: string;

  // ✅ birthDate — как на фронтенде
  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  licenseExpiry: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
