import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiAddContext = () =>
    applyDecorators(
        ApiOperation({ summary: 'Add user context for RAG' }),
        ApiResponse({
            status: 201,
            description: 'Context added successfully',
            schema: {
                example: SwaggerExamples.RAG.Context.Add.response,
            },
        }),
    );

export const ApiGetContexts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get user contexts' }),
        ApiResponse({
            status: 200,
            description: 'User contexts retrieved successfully',
            schema: {
                example: SwaggerExamples.RAG.Context.List.response,
            },
        }),
    );

export const ApiDeleteContext = () =>
    applyDecorators(
        ApiOperation({ summary: 'Delete user context' }),
        ApiParam({ name: 'id', description: 'Context ID' }),
        ApiResponse({
            status: 200,
            description: 'Context deleted successfully',
            schema: {
                example: SwaggerExamples.RAG.Context.Delete.response,
            },
        }),
    );
