import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { BaseDocument } from '../document/entities/base-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseDocument])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {} 