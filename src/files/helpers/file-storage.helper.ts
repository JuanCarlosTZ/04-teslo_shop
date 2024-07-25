import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";

export const FileStorageHelper = diskStorage({
    destination: './static/products',
    filename(req, file, callback) {
        if (!file) {
            return callback(new BadRequestException('File is empty'), '');
        }
        const fileExtension = file.mimetype.split('/')[1];
        const fileName = `${randomUUID()}.${fileExtension}`;
        callback(null, fileName);
    },
});

