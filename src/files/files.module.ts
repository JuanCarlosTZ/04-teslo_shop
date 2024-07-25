import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    // MulterModule.register({
    //   // dest: './uploads', // directorio donde se guardarán los archivos
    // }),
  ]
})
export class FilesModule { }
