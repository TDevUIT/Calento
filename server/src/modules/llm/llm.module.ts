import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangChainService } from './langchain.service';

@Module({
    imports: [ConfigModule],
    providers: [LangChainService],
    exports: [LangChainService],
})
export class LLMModule { }
