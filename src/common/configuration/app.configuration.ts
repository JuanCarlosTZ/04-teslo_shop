import { ConfigService } from "@nestjs/config";
import { AppConfig } from "../interfaces/env-config.interface";

export class AppConfiguration {
    static envConfig = () => ({
        dbName: process.env.DB_NAME,
        dbUsername: process.env.DB_USERNAME,
        dbPassword: process.env.DB_PASSWORD,
        dbPort: +process.env.DB_PORT,
        imageExtensions: process.env.IMAGE_EXTENSIONS,
        defaultPaginationLimit: +process.env.DEFAULT_PAGINATION_LIMIT,
        port: +process.env.PORT,
    });

    appConfig(): AppConfig {

        return {
            dbName: AppConfiguration.envConfig().dbName,
            dbUsername: AppConfiguration.envConfig().dbUsername,
            dbPassword: AppConfiguration.envConfig().dbPassword,
            dbPort: AppConfiguration.envConfig().dbPort,
            imageExtensions: AppConfiguration.envConfig().imageExtensions.split(','),
            defaultPaginationLimit: AppConfiguration.envConfig().defaultPaginationLimit,
            port: AppConfiguration.envConfig().port,
        }
    }


}