import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from './common/swagger/swagger-examples';

export const ApiGetCorsConfig = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get CORS configuration' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'CORS configuration',
            schema: {
                example: SwaggerExamples.Debug.Cors.response,
            },
        }),
    );
