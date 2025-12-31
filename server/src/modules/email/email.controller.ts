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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './services/email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserId,
} from '../../common/decorators/current-user.decorator';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import { TIME_CONSTANTS } from '../../common/constants';
import {
  ApiSendEmail,
  ApiGetEmailLogs,
  ApiGetEmailLogById,
  ApiSendTestWelcomeEmail,
  ApiSendTestReminderEmail,
} from './email.swagger';

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly messageService: MessageService,
  ) { }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiSendEmail()
  async sendEmail(
    @Body() sendEmailDto: SendEmailDto,
    @CurrentUserId() userId: string,
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
  @ApiGetEmailLogs()
  async getEmailLogs(
    @CurrentUserId() userId: string,
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
  @ApiGetEmailLogById()
  async getEmailLogById(
    @Param('id') logId: string,
    @CurrentUserId() userId: string,
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
  @ApiSendTestWelcomeEmail()
  async sendTestWelcomeEmail(
    @CurrentUserId() userId: string,
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
  @ApiSendTestReminderEmail()
  async sendTestReminderEmail(
    @CurrentUserId() userId: string,
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
