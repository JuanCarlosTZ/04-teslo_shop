import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, ParseFilePipe, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilterHelper } from './helpers/file-filter.helper';
import { FileStorageHelper } from './helpers/file-storage.helper';
import { Response } from 'express';
import { ParseFilenamePipe } from './pipes/file-name.pipe';
import { limitSize } from './helpers/file-limit.helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('products')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilterHelper,
    limits: { fileSize: limitSize },
    storage: FileStorageHelper,
  }))
  @ApiResponse({ status: 201, description: 'File was created (generated image id)', type: String })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  uploadOne(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File): string {
    return file.filename;
  }

  @Get('products/:filename')
  @ApiResponse({ status: 201, description: 'Return an image file' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  findOne(@Res() res: Response, @Param('filename', ParseFilenamePipe) filename: string) {
    const path = this.filesService.findOne(filename);
    res.sendFile(path);
  }
}
