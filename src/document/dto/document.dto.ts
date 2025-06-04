import { IsUUID, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ConflictStatus } from '../entities/base-document.entity';

export class CreateDocumentDto {
  @IsString()
  content: string;

  @IsUUID()
  clientId: string;

  @IsNumber()
  clientTimestamp: number;
}

export class UpdateDocumentDto {
  @IsString()
  content: string;

  @IsUUID()
  clientId: string;

  @IsNumber()
  clientTimestamp: number;

  @IsNumber()
  version: number;
}

export class SyncDocumentsDto {
  @IsNumber()
  lastSyncTimestamp: number;

  @IsUUID()
  clientId: string;
}

export class ResolveConflictDto {
  @IsUUID()
  documentId: string;

  @IsUUID()
  clientId: string;

  @IsEnum(ConflictStatus)
  resolution: ConflictStatus;

  @IsString()
  @IsOptional()
  mergedContent?: string;
}

export class DocumentResponseDto {
  id: string;
  content: string;
  version: number;
  clientId: string;
  clientTimestamp: number;
  serverTimestamp: number;
  isDeleted: boolean;
  conflictsWith?: string;
  conflictStatus: ConflictStatus;
  createdAt: Date;
  updatedAt: Date;
} 