import { Controller, Get, Post, Body, Put, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, SyncDocumentsDto, ResolveConflictDto, DocumentResponseDto } from './dto/document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<DocumentResponseDto> {
    return this.documentService.create(createDocumentDto);
  }

  @Get()
  async findAll(): Promise<DocumentResponseDto[]> {
    return this.documentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('clientId') clientId: string,
  ): Promise<void> {
    await this.documentService.softDelete(id, clientId);
  }

  @Post('sync')
  async sync(@Body() syncDto: SyncDocumentsDto): Promise<DocumentResponseDto[]> {
    return this.documentService.sync(syncDto);
  }

  @Get('conflicts')
  async getConflicts(): Promise<DocumentResponseDto[]> {
    return this.documentService.getConflicts();
  }

  @Post('resolve-conflict')
  async resolveConflict(@Body() resolveDto: ResolveConflictDto): Promise<DocumentResponseDto> {
    return this.documentService.resolveConflict(resolveDto);
  }
} 