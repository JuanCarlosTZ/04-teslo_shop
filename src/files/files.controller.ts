import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ParseFilePipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilterHelper } from './helpers/file-filter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilterHelper
  }))
  uploadOne(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {

    return file.originalname;
  }
}
