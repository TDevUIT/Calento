import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { EmailLogResponseDto } from './dto/send-email.dto';

export const ApiSendEmail = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Send email',
            description: 'Send email using Nodemailer with optional template support',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Email sent successfully',
            schema: {
                example: SwaggerExamples.Email.Send.response,
            },
        }),
        ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email data' }),
        ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to send email' }),
    );

export const ApiGetEmailLogs = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get email logs',
            description: 'Retrieve email sending history for current user',
        }),
        ApiQuery({ name: 'limit', required: false, type: Number, example: 50 }),
        ApiQuery({ name: 'offset', required: false, type: Number, example: 0 }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Email logs retrieved successfully',
            type: [EmailLogResponseDto],
            schema: {
                example: SwaggerExamples.Email.Logs.response,
            },
        }),
    );

export const ApiGetEmailLogById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get email log by ID',
            description: 'Retrieve specific email log details',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Email log retrieved successfully',
            type: EmailLogResponseDto,
            schema: {
                example: SwaggerExamples.Email.Logs.response[0],
            },
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Email log not found' }),
    );

export const ApiSendTestWelcomeEmail = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Send test welcome email',
            description: 'Send a test welcome email to verify configuration',
        }),
        ApiResponse({ status: HttpStatus.OK, description: 'Test email sent successfully' }),
    );

export const ApiSendTestReminderEmail = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Send test event reminder email',
            description: 'Send a test event reminder email to verify configuration',
        }),
        ApiResponse({ status: HttpStatus.OK, description: 'Test email sent successfully' }),
    );
