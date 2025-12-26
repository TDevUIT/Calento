import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AIConversationService } from './services/conversation.service';
import { ChatRequestDto, ChatResponseDto, ConfirmActionDto } from './dto/ai-chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  private readonly logger = new Logger(AIController.name);

  constructor(private readonly conversationService: AIConversationService) { }

  private getUserId = (req: any): string => req.user?.id || req.user?.sub;

  @Get('health')
  @ApiOperation({ summary: 'Check AI service health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      service: 'AI Assistant',
      timestamp: new Date().toISOString(),
      message: 'AI service is running'
    };
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Chat with AI assistant',
    description: 'Send a message to the AI assistant for calendar management tasks'
  })
  @ApiResponse({
    status: 200,
    description: 'AI response with optional function calls',
    type: ChatResponseDto
  })
  async chat(
    @Body() dto: ChatRequestDto,
    @Req() req: any,
  ): Promise<ChatResponseDto> {
    const userId = this.getUserId(req);

    try {
      this.logger.log(`AI Chat request from user: ${userId}`);
      this.logger.log(`Message: "${dto.message.substring(0, 50)}..."`);

      const result = await this.conversationService.chat(
        dto.message,
        userId,
        dto.conversation_id,
        dto.context
      );

      this.logger.log(`AI Chat completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`AI Chat failed:`, error.stack);
      throw error;
    }
  }
  @Post('chat/stream')
  @ApiOperation({
    summary: 'Stream chat with AI assistant',
    description: 'Stream AI response using Server-Sent Events'
  })
  async chatStream(
    @Body() dto: ChatRequestDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const userId = this.getUserId(req);
    this.logger.log(`AI Chat Stream request from user: ${userId}`);

    (req.socket as any)?.setNoDelay?.(true);

    // Set SSE headers
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx
    res.flushHeaders();

    // Initial connection event
    res.write(`event: status\ndata: ${JSON.stringify({ content: 'connected' })}\n\n`);
    (res as any).flush?.();

    const heartbeat = setInterval(() => {
      res.write(`: ping\n\n`);
      (res as any).flush?.();
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      res.end();
    });

    try {
      const stream = this.conversationService.chatStream(
        dto.message,
        userId,
        dto.conversation_id,
        dto.context
      );

      for await (const event of stream) {
        // Format based on event type
        if (event.type === 'text') {
          res.write(`event: text\ndata: ${JSON.stringify({ content: event.content })}\n\n`);
        } else if (event.type === 'action_start') {
          res.write(`event: action_start\ndata: ${JSON.stringify({ action: event.action })}\n\n`);
        } else if (event.type === 'action_result') {
          res.write(`event: action_result\ndata: ${JSON.stringify({ action: event.action })}\n\n`);
        }
        (res as any).flush?.();
      }

      // Send done event
      res.write(`event: done\ndata: ${JSON.stringify({ conversation_id: dto.conversation_id })}\n\n`);
      res.end();

    } catch (error) {
      this.logger.error(`Stream error: ${error.message}`);
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } finally {
      clearInterval(heartbeat);
    }
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Get user conversations',
    description: 'Retrieve conversation history for the current user'
  })
  @ApiResponse({
    status: 200,
    description: 'List of conversations',
    type: [Object]
  })
  async getConversations(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.conversationService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({
    summary: 'Get conversation details',
    description: 'Retrieve a specific conversation with all messages and actions'
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation details'
  })
  async getConversation(
    @Param('id') conversationId: string,
    @Req() req: any
  ) {
    const userId = this.getUserId(req);
    return this.conversationService.getConversation(conversationId, userId);
  }

  @Delete('conversations/:id')
  @ApiOperation({
    summary: 'Delete conversation',
    description: 'Delete a conversation and all its messages'
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully'
  })
  async deleteConversation(
    @Param('id') conversationId: string,
    @Req() req: any
  ) {
    const userId = this.getUserId(req);
    await this.conversationService.deleteConversation(conversationId, userId);
    return {
      success: true,
      message: 'Conversation deleted successfully'
    };
  }

  @Post('actions/confirm')
  @ApiOperation({
    summary: 'Confirm pending action',
    description: 'User confirms or rejects a pending action that requires confirmation'
  })
  @ApiResponse({
    status: 200,
    description: 'Action confirmed and executed',
    type: ChatResponseDto
  })
  async confirmAction(
    @Body() dto: ConfirmActionDto,
    @Req() req: any
  ): Promise<ChatResponseDto> {
    const userId = this.getUserId(req);

    this.logger.log(`Action confirmation: ${dto.action_id} - ${dto.confirmed ? 'Approved' : 'Rejected'}`);

    return this.conversationService.confirmAction(
      dto.action_id,
      userId,
      dto.confirmed,
      dto.modified_parameters,
      dto.conversation_id
    );
  }
}
