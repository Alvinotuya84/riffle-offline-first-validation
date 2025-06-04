import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsUUID, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export enum ConflictStatus {
  ACTIVE = 'active',
  HAS_CONFLICT = 'has_conflict',
  PENDING = 'pending',
  RESOLVED = 'resolved'
}

@Entity('documents')
export class BaseDocument {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column('text')
  @IsString()
  content: string;

  @Column('int')
  @IsNumber()
  version: number;

  @Column('uuid')
  @IsUUID()
  clientId: string;

  @Column('bigint')
  @IsNumber()
  clientTimestamp: number;

  @Column('bigint')
  @IsNumber()
  serverTimestamp: number;

  @Column('boolean', { default: false })
  @IsBoolean()
  isDeleted: boolean;

  @Column('uuid', { nullable: true })
  @IsUUID()
  conflictsWith?: string;

  @Column({
    type: 'enum',
    enum: ConflictStatus,
    default: ConflictStatus.ACTIVE
  })
  @IsEnum(ConflictStatus)
  conflictStatus: ConflictStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 