import { BadRequestException, Injectable } from "@nestjs/common";
import { AppConfiguration } from "src/common/configuration/app.configuration";
import { AppConfig } from "src/common/interfaces/env-config.interface";

export const FileFilterHelper = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) {
        return callback(new BadRequestException('Make sure that the fila is an image'), false);
    }

    const appConfig: AppConfig = new AppConfiguration().appConfig();
    const validExtensions = appConfig.imageExtensions;
    const fileExtension = file.mimetype.split('/')[1];

    if (!validExtensions.includes(fileExtension)) {
        return callback(new BadRequestException('Make sure that the fila is an image'), false);
    }

    return callback(null, true);
}


