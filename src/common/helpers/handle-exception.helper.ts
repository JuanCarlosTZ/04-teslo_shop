import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Injectable()
export class HandlerHelper {

    private async handelException<T>(context: string, error: QueryFailedError | any): Promise<T> {
        const logger = new Logger(context);
        logger.error(error);
        console.log(`code: ${error.code}`);
        console.log(`error: $${error.detail}`);
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }

        if (error.code === '22P02') {
            throw new BadRequestException(`Not exists a product by submmited id`);
        }

        if (error.status == HttpStatus.BAD_REQUEST) {
            throw error;
        }

        if (error.status == HttpStatus.NOT_FOUND) {
            throw error;
        }

        throw new InternalServerErrorException('Unespected error. Check server logs.');
    }

    async exception<T>(
        context: any,
        callback: Function,
        onError?: (error) => Promise<void>
    ): Promise<T> {
        try {
            return await callback();
        } catch (error) {
            if (onError) {
                await onError(error);
            }
            return this.handelException(context, error);
        }
    }
}