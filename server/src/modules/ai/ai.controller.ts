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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AIConversationService } from './services/conversation.service';
import {
  ChatRequestDto,
  ChatResponseDto,
  ConfirmActionDto,
} from './dto/ai-chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiHealthCheck,
  ApiChat,
  ApiChatStream,
  ApiGetConversations,
  ApiGetConversation,
  ApiDeleteConversation,
  ApiConfirmAction,
} from './ai.swagger';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  private readonly logger = new Logger(AIController.name);

  constructor(private readonly conversationService: AIConversationService) { }

  private getUserId = (req: any): string => req.user?.id || req.user?.sub;

  @Get('health')
  @ApiHealthCheck()
  async healthCheck() {
    return {
      status: 'ok',
      service: 'AI Assistant',
      timestamp: new Date().toISOString(),
      message: 'AI service is running',
    };
  }

  @Post('chat')
  @ApiChat()
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
        dto.context,
      );

      this.logger.log(`AI Chat completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`AI Chat failed:`, error.stack);
      throw error;
    }
  }

  @Post('chat/stream')
  @ApiChatStream()
  async chatStream(
    @Body() dto: ChatRequestDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const userId = this.getUserId(req);
    this.logger.log(`AI Chat Stream request from user: ${userId}`);

    req.socket?.setNoDelay?.(true);

    // Set SSE headers
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx
    res.flushHeaders();

    // Initial connection event
    res.write(
      `event: status\ndata: ${JSON.stringify({ content: 'connected' })}\n\n`,
    );
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
        dto.context,
      );

      for await (const event of stream) {
        // Format based on event type
        if (event.type === 'text') {
          res.write(
            `event: text\ndata: ${JSON.stringify({ content: event.content })}\n\n`,
          );
        } else if (event.type === 'action_start') {
          res.write(
            `event: action_start\ndata: ${JSON.stringify({ action: event.action })}\n\n`,
          );
        } else if (event.type === 'action_result') {
          res.write(
            `event: action_result\ndata: ${JSON.stringify({ action: event.action })}\n\n`,
          );
        }
        (res as any).flush?.();
      }

      // Send done event
      res.write(
        `event: done\ndata: ${JSON.stringify({ conversation_id: dto.conversation_id })}\n\n`,
      );
      res.end();
    } catch (error) {
      this.logger.error(`Stream error: ${error.message}`);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`,
      );
      res.end();
    } finally {
      clearInterval(heartbeat);
    }
  }

  @Get('conversations')
  @ApiGetConversations()
  async getConversations(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.conversationService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  @ApiGetConversation()
  async getConversation(@Param('id') conversationId: string, @Req() req: any) {
    const userId = this.getUserId(req);
    return this.conversationService.getConversation(conversationId, userId);
  }

  @Delete('conversations/:id')
  @ApiDeleteConversation()
  async deleteConversation(
    @Param('id') conversationId: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(req);
    await this.conversationService.deleteConversation(conversationId, userId);
    return {
      success: true,
      message: 'Conversation deleted successfully',
    };
  }

  @Post('actions/confirm')
  @ApiConfirmAction()
  async confirmAction(
    @Body() dto: ConfirmActionDto,
    @Req() req: any,
  ): Promise<ChatResponseDto> {
    const userId = this.getUserId(req);

    this.logger.log(
      `Action confirmation: ${dto.action_id} - ${dto.confirmed ? 'Approved' : 'Rejected'}`,
    );

    return this.conversationService.confirmAction(
      dto.action_id,
      userId,
      dto.confirmed,
      dto.modified_parameters,
      dto.conversation_id,
    );
  }
}
