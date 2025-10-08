import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EmailService } from './services/email.service';
import { SendEmailDto, EmailLogResponseDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import { TIME_CONSTANTS } from '../../common/constants';

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly messageService: MessageService,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send email',
    description: 'Send email using Nodemailer with optional template support',
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Email sent successfully',
        data: {
          messageId: '<message-id@smtp.example.com>',
          logId: 'uuid-here',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email data' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  async sendEmail(
    @Body() sendEmailDto: SendEmailDto,
    @CurrentUser('id') userId: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.emailService.sendEmail(
      {
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: sendEmailDto.html,
        text: sendEmailDto.text,
        template: sendEmailDto.template,
        context: sendEmailDto.context,
        cc: sendEmailDto.cc,
        bcc: sendEmailDto.bcc,
      },
      userId,
    );

    if (result.success) {
      return new SuccessResponseDto(
        this.messageService.get('email.sent_successfully'),
        {
          messageId: result.messageId,
          logId: result.logId,
        },
      );
    } else {
      throw new Error(
        result.error || this.messageService.get('email.send_failed'),
      );
    }
  }

  @Get('logs')
  @ApiOperation({
    summary: 'Get email logs',
    description: 'Retrieve email sending history for current user',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'Email logs retrieved successfully',
    type: [EmailLogResponseDto],
  })
  async getEmailLogs(
    @CurrentUser('id') userId: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ): Promise<PaginatedResponseDto> {
    const logs = await this.emailService.getEmailLogs(
      userId,
      Number(limit),
      Number(offset),
    );

    return new PaginatedResponseDto(
      this.messageService.get('email.logs_retrieved'),
      logs,
      {
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        limit: Number(limit),
        total: logs.length,
        totalPages: Math.ceil(logs.length / Number(limit)),
      },
    );
  }

  @Get('logs/:id')
  @ApiOperation({
    summary: 'Get email log by ID',
    description: 'Retrieve specific email log details',
  })
  @ApiResponse({
    status: 200,
    description: 'Email log retrieved successfully',
    type: EmailLogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Email log not found' })
  async getEmailLogById(
    @Param('id') logId: string,
    @CurrentUser('id') userId: string,
  ): Promise<SuccessResponseDto> {
    const log = await this.emailService.getEmailLogById(logId, userId);

    if (!log) {
      return new SuccessResponseDto(
        this.messageService.get('email.log_not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    return new SuccessResponseDto(
      this.messageService.get('email.log_retrieved'),
      log,
    );
  }

  @Post('test/welcome')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send test welcome email',
    description: 'Send a test welcome email to verify configuration',
  })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  async sendTestWelcomeEmail(
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
    @CurrentUser('username') username: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.emailService.sendWelcomeEmail(
      userId,
      email,
      username || 'User',
    );

    return new SuccessResponseDto(
      result.success
        ? this.messageService.get('email.test_welcome_sent')
        : this.messageService.get('email.test_send_failed'),
      result,
    );
  }

  @Post('test/reminder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send test event reminder email',
    description: 'Send a test event reminder email to verify configuration',
  })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  async sendTestReminderEmail(
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.emailService.sendEventReminderEmail(
      userId,
      email,
      {
        title: 'Test Event - Team Meeting',
        startTime: new Date(
          Date.now() + TIME_CONSTANTS.EMAIL.TEST_REMINDER_DELAY,
        ),
        location: 'Conference Room A',
        description: 'This is a test event reminder',
      },
    );

    return new SuccessResponseDto(
      result.success
        ? this.messageService.get('email.test_reminder_sent')
        : this.messageService.get('email.test_send_failed'),
      result,
    );
  }
}
