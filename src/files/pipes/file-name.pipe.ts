import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { IsString, isUUID } from "class-validator";
import { AppConfiguration } from "src/common/configuration/app.configuration";


@Injectable()
export class ParseFilenamePipe implements PipeTransform {
    constructor(private readonly appConfiguration: AppConfiguration) { }
    transform(value: string) {
        if (!value) throw new BadRequestException('File name is required');
        const fileName = value.split('.')[0] || '';
        const fileExtension = value.split('.')[1] || '';

        if (!isUUID(fileName)) throw new BadRequestException('Invalid file name');

        const validExtensions: string[] = this.appConfiguration.appConfig().imageExtensions
        if (fileExtension in validExtensions) {
            throw new BadRequestException('Invalid file extension');
        }

        return value;
    }
}