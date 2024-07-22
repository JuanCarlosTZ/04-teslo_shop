export class AppConfiguration {
    static envConfig = () => ({
        dbName: process.env.DB_NAME,
        dbUsername: process.env.DB_USERNAME,
        dbPassword: process.env.DB_PASSWORD,
        dbPort: +process.env.DB_PORT,
        defaultPaginationLimit: +process.env.DEFAULT_PAGINATION_LIMIT,
        port: process.env.PORT,
    });

}