export interface AppConfig {
    dbName: string,
    dbUsername: string,
    dbPassword: string,
    dbPort: number,
    imageExtensions: string[],
    defaultPaginationLimit: number,
    port: number,
}