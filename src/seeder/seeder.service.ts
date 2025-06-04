import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseDocument, ConflictStatus } from '../document/entities/base-document.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(BaseDocument)
    private documentRepository: Repository<BaseDocument>,
  ) {}

  async seed() {
    // Clear existing data
    await this.documentRepository.clear();

    const clientIds = [uuidv4(), uuidv4()]; // Two different clients
    const now = Date.now();
    const documents: Partial<BaseDocument>[] = [];

    // Create some active documents
    for (let i = 0; i < 5; i++) {
      documents.push({
        content: `Active document ${i + 1}`,
        version: 1,
        clientId: clientIds[0],
        clientTimestamp: now - (i * 1000),
        serverTimestamp: now - (i * 1000),
        isDeleted: false,
        conflictStatus: ConflictStatus.ACTIVE,
      });
    }

    // Create some documents with conflicts
    for (let i = 0; i < 3; i++) {
      const docId = uuidv4();
      documents.push({
        id: docId,
        content: `Document with conflict ${i + 1}`,
        version: 2,
        clientId: clientIds[1],
        clientTimestamp: now - (i * 2000),
        serverTimestamp: now - (i * 2000),
        isDeleted: false,
        conflictStatus: ConflictStatus.HAS_CONFLICT,
      });

      // Create the conflicting version
      documents.push({
        content: `Conflicting version of document ${i + 1}`,
        version: 2,
        clientId: clientIds[0],
        clientTimestamp: now - (i * 2000) + 1000,
        serverTimestamp: now - (i * 2000) + 1000,
        isDeleted: false,
        conflictsWith: docId,
        conflictStatus: ConflictStatus.PENDING,
      });
    }

    // Create some soft-deleted documents
    for (let i = 0; i < 2; i++) {
      documents.push({
        content: `Deleted document ${i + 1}`,
        version: 1,
        clientId: clientIds[0],
        clientTimestamp: now - (i * 3000),
        serverTimestamp: now - (i * 3000),
        isDeleted: true,
        conflictStatus: ConflictStatus.ACTIVE,
      });
    }

    // Save all documents
    await this.documentRepository.save(documents);

    return {
      message: 'Database seeded successfully',
      documentsCount: documents.length,
      clientIds,
    };
  }
} 