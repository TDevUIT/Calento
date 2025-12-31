import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { ChatResponseDto } from './dto/ai-chat.dto';

export const ApiHealthCheck = () =>
    applyDecorators(
        ApiOperation({ summary: 'Check AI service health' }),
        ApiResponse({
            status: 200,
            description: 'Service is healthy',
            schema: {
                example: {
                    status: 'ok',
                    service: 'AI Assistant',
                    timestamp: '2024-01-15T10:00:00Z',
                    message: 'AI service is running',
                },
            },
        }),
    );

export const ApiChat = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Chat with AI assistant',
            description:
                'Send a message to the AI assistant for calendar management tasks',
        }),
        ApiResponse({
            status: 200,
            description: 'AI response with optional function calls',
            type: ChatResponseDto,
            schema: {
                example: SwaggerExamples.AI.Chat.response,
            },
        }),
    );

export const ApiChatStream = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Stream chat with AI assistant',
            description: 'Stream AI response using Server-Sent Events',
        }),
        ApiResponse({
            status: 200,
            description: 'Streamed AI response (SSE)',
            content: {
                'text/event-stream': {
                    schema: {
                        type: 'string',
                        example: 'event: status\ndata: {"content": "connected"}\n\n',
                    },
                },
            },
        }),
    );

export const ApiGetConversations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get user conversations',
            description: 'Retrieve conversation history for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'List of conversations',
            schema: {
                example: SwaggerExamples.AI.Conversations.List.response,
            },
        }),
    );

export const ApiGetConversation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get conversation details',
            description:
                'Retrieve a specific conversation with all messages and actions',
        }),
        ApiParam({ name: 'id', description: 'Conversation ID' }),
        ApiResponse({
            status: 200,
            description: 'Conversation details',
            schema: {
                example: SwaggerExamples.AI.Conversations.Details.response,
            },
        }),
    );

export const ApiDeleteConversation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Delete conversation',
            description: 'Delete a conversation and all its messages',
        }),
        ApiParam({ name: 'id', description: 'Conversation ID' }),
        ApiResponse({
            status: 200,
            description: 'Conversation deleted successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Conversation deleted successfully',
                },
            },
        }),
    );

export const ApiConfirmAction = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Confirm pending action',
            description:
                'User confirms or rejects a pending action that requires confirmation',
        }),
        ApiResponse({
            status: 200,
            description: 'Action confirmed and executed',
            type: ChatResponseDto,
            schema: {
                example: SwaggerExamples.AI.ConfirmAction.response,
            },
        }),
    );
