import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration } from './configuration/app.configuration';

@Module({
    providers: [AppConfiguration],
    imports: [ConfigModule],
    exports: [AppConfiguration]
})
export class CommonModule { }
