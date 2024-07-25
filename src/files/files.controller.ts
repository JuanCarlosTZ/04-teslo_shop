import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ParseFilePipe, Query, Res, ParseUUIDPipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilterHelper } from './helpers/file-filter.helper';
import { FileStorageHelper } from './helpers/file-storage.helper';
import { Response } from 'express';
import { ParseFilenamePipe } from './pipes/file-name.pipe';
import { limitSize } from './helpers/file-limit.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('products')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilterHelper,
    limits: { fileSize: limitSize },
    storage: FileStorageHelper,
  }))
  uploadOne(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    return file.filename;
  }

  @Get('products/:filename')
  findOne(@Res() res: Response, @Param('filename', ParseFilenamePipe) filename: string) {
    const path = this.filesService.findOne(filename);
    res.sendFile(path);
  }
}
