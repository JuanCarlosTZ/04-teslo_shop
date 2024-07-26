import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration } from './configuration/app.configuration';
import { HandlerHelper } from './helpers/handle-exception.helper';

@Module({
    providers: [AppConfiguration, HandlerHelper],
    imports: [ConfigModule],
    exports: [AppConfiguration, HandlerHelper]
})
export class CommonModule { }
