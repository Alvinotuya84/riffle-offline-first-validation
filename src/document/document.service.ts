import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { BaseDocument, ConflictStatus } from './entities/base-document.entity';
import { CreateDocumentDto, UpdateDocumentDto, SyncDocumentsDto, ResolveConflictDto } from './dto/document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(BaseDocument)
    private documentRepository: Repository<BaseDocument>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<BaseDocument> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      version: 1,
      serverTimestamp: Date.now(),
    });
    return this.documentRepository.save(document);
  }

  async findAll(): Promise<BaseDocument[]> {
    return this.documentRepository.find({
      where: { isDeleted: false },
      order: { serverTimestamp: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BaseDocument> {
    const document = await this.documentRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<BaseDocument> {
    const existingDoc = await this.findOne(id);
    
    // Check for conflicts
    if (existingDoc.version !== updateDocumentDto.version - 1) {
      throw new ConflictException('Version mismatch detected');
    }

    if (existingDoc.serverTimestamp > updateDocumentDto.clientTimestamp) {
      throw new ConflictException('Server has a newer version');
    }

    const updatedDoc = this.documentRepository.merge(existingDoc, {
      ...updateDocumentDto,
      serverTimestamp: Date.now(),
    });

    return this.documentRepository.save(updatedDoc);
  }

  async softDelete(id: string, clientId: string): Promise<void> {
    const document = await this.findOne(id);
    document.isDeleted = true;
    document.serverTimestamp = Date.now();
    await this.documentRepository.save(document);
  }

  async sync(syncDto: SyncDocumentsDto): Promise<BaseDocument[]> {
    return this.documentRepository.find({
      where: {
        serverTimestamp: MoreThan(syncDto.lastSyncTimestamp),
        isDeleted: false,
      },
      order: { serverTimestamp: 'ASC' },
    });
  }

  async getConflicts(): Promise<BaseDocument[]> {
    return this.documentRepository.find({
      where: {
        conflictStatus: ConflictStatus.HAS_CONFLICT,
        isDeleted: false,
      },
    });
  }

  async resolveConflict(resolveDto: ResolveConflictDto): Promise<BaseDocument> {
    const document = await this.findOne(resolveDto.documentId);
    
    if (document.conflictStatus !== ConflictStatus.HAS_CONFLICT) {
      throw new ConflictException('Document is not in conflict state');
    }

    if (resolveDto.resolution === ConflictStatus.RESOLVED) {
      if (!resolveDto.mergedContent) {
        throw new ConflictException('Merged content is required for resolution');
      }
      document.content = resolveDto.mergedContent;
    }

    document.conflictStatus = ConflictStatus.RESOLVED;
    document.serverTimestamp = Date.now();
    document.version += 1;

    return this.documentRepository.save(document);
  }
} 