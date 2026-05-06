import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('crew_members')
export class CrewMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'PILOT' })
  category: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  position: string;

  /*@Column({ nullable: true })
  licenseNumber: string;
*/
  @Column({ type: 'float', default: 0 })
  totalHours: number;

  @Column({ nullable: true })
  aircraftType: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  licenseExpiry: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
