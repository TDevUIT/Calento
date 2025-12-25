import { Injectable, Logger } from '@nestjs/common';
import { APP_URL_CONSTANTS } from '../../../common/constants';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import {
  EmailOptions,
  EmailConfig,
  SendEmailResult,
  EmailStatus,
} from '../interfaces/email.interface';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private emailConfig: EmailConfig;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.initializeEmailConfig();
    this.initializeTransporter();
    this.registerHandlebarsHelpers();
  }

  private initializeEmailConfig(): void {
    this.emailConfig = {
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<string>('SMTP_SECURE', 'false') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: (this.configService.get<string>('SMTP_PASSWORD', '') || '').replace(/\s+/g, ''),
      },
      from: this.configService.get<string>(
        'SMTP_FROM',
        'Calento <noreply@calento.space>',
      ),
    };
  }

  private initializeTransporter(): void {
    const transporterConfig = {
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: this.emailConfig.secure,
      auth: this.emailConfig.auth,
      tls: {
        rejectUnauthorized: false,
      },
    };

    if (
      this.emailConfig.host === 'smtp.gmail.com' &&
      this.emailConfig.port === 587
    ) {
      transporterConfig['requireTLS'] = true;
      transporterConfig['tls'] = {
        rejectUnauthorized: false,
      };
    }

    this.transporter = nodemailer.createTransport(transporterConfig);

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email transporter verification failed:');
        this.logger.error(error);

        if (this.emailConfig.host === 'smtp.gmail.com') {
          this.logger.warn('Gmail SMTP Debug Tips:');
          this.logger.warn('1. Enable 2-Factor Authentication on Gmail');
          this.logger.warn('2. Generate App Password (not regular password)');
          this.logger.warn('3. Use App Password in SMTP_PASSWORD');
          this.logger.warn(
            '4. Ensure Less Secure Apps is enabled (if not using App Password)',
          );
        }
      } else {
        this.logger.log('Email server is ready to send messages');
      }
    });
  }

  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      if (!date) return '';
      return new Date(date).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    Handlebars.registerHelper('year', () => {
      return new Date().getFullYear();
    });

    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
  }

  private async loadTemplate(
    templateName: string,
  ): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const possiblePaths = [
      path.join(__dirname, '..', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'src', 'modules', 'email', 'templates', `${templateName}.hbs`),
      path.join(__dirname, '..', '..', '..', 'src', 'modules', 'email', 'templates', `${templateName}.hbs`),
    ];

    let templateSource: string | null = null;
    let usedPath: string | null = null;

    for (const templatePath of possiblePaths) {
      try {
        if (fs.existsSync(templatePath)) {
          templateSource = fs.readFileSync(templatePath, 'utf-8');
          usedPath = templatePath;
          this.logger.log(`âœ… Loaded template ${templateName} from: ${templatePath}`);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!templateSource || !usedPath) {
      this.logger.error(`Failed to load template ${templateName}. Tried paths:`, possiblePaths);
      throw new Error(`Template ${templateName} not found in any expected location`);
    }

    try {
      const template = Handlebars.compile(templateSource);
      this.templateCache.set(templateName, template);
      return template;
    } catch (error) {
      this.logger.error(`Failed to compile template ${templateName}:`, error);
      throw new Error(`Template ${templateName} compilation failed`);
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const template = await this.loadTemplate(templateName);

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      APP_URL_CONSTANTS.DEFAULTS.FRONTEND,
    );

    const fullContext = {
      ...context,
      year: new Date().getFullYear(),
      dashboardUrl: `${frontendUrl}${APP_URL_CONSTANTS.FRONTEND_ROUTES.DASHBOARD}`,
      docsUrl: `${frontendUrl}${APP_URL_CONSTANTS.FRONTEND_ROUTES.DOCS}`,
      calendarUrl: `${frontendUrl}${APP_URL_CONSTANTS.FRONTEND_ROUTES.CALENDAR}`,
    };

    return template(fullContext);
  }

  async sendEmail(
    options: EmailOptions,
    userId?: string,
  ): Promise<SendEmailResult> {
    try {
      if (!this.emailConfig.auth.user || !this.emailConfig.auth.pass) {
        this.logger.warn('âš ï¸  SMTP credentials not configured - Email will not be sent');
        this.logger.warn('ðŸ“§ Email details:', {
          to: options.to,
          subject: options.subject,
          template: options.template,
        });

        return {
          success: false,
          error:
            'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.',
        };
      }

      let html = options.html;
      const text = options.text;

      if (options.template && options.context) {
        html = await this.renderTemplate(options.template, options.context);
      }

      const mailOptions = {
        from: options.from || this.emailConfig.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html,
        text,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(', ')
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(', ')
            : options.bcc
          : undefined,
        attachments: options.attachments,
      };

      let logId: string | undefined;
      if (userId) {
        logId = await this.createEmailLog(
          userId,
          Array.isArray(options.to) ? options.to[0] : options.to,
          options.subject,
          options.template,
          EmailStatus.PENDING,
        );
      }

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`âœ… Email sent successfully: ${info.messageId}`);

      if (logId) {
        await this.updateEmailLog(
          logId,
          EmailStatus.SENT,
          undefined,
          new Date(),
        );
      }

      return {
        success: true,
        messageId: info.messageId,
        logId,
      };
    } catch (error) {
      this.logger.error('Failed to send email:', error);

      if (userId) {
        const logId = await this.createEmailLog(
          userId,
          Array.isArray(options.to) ? options.to[0] : options.to,
          options.subject,
          options.template,
          EmailStatus.FAILED,
          error.message,
        );

        return {
          success: false,
          error: error.message,
          logId,
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendWelcomeEmail(
    userId: string,
    email: string,
    userName: string,
  ): Promise<SendEmailResult> {
    return this.sendEmail(
      {
        to: email,
        subject: 'Welcome to Calento!',
        template: 'welcome',
        context: { userName },
      },
      userId,
    );
  }

  async sendEventReminderEmail(
    userId: string,
    email: string,
    eventDetails: {
      title: string;
      startTime: Date;
      location?: string;
      description?: string;
    },
  ): Promise<SendEmailResult> {
    return this.sendEmail(
      {
        to: email,
        subject: `Reminder: ${eventDetails.title}`,
        template: 'event-reminder',
        context: {
          ...eventDetails,
          eventUrl: `${this.configService.get<string>('FRONTEND_URL')}/events/${eventDetails.title}`,
        },
      },
      userId,
    );
  }

  async sendPasswordResetEmail(
    userId: string,
    email: string,
    userName: string,
    identifier: string,
    secret: string,
  ): Promise<SendEmailResult> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?identifier=${identifier}&secret=${secret}`;

    return this.sendEmail(
      {
        to: email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context: {
          userName,
          resetUrl,
          expiresIn: 24,
        },
      },
      userId,
    );
  }

  private async createEmailLog(
    userId: string,
    to: string,
    subject: string,
    template: string | undefined,
    status: EmailStatus,
    errorMessage?: string,
  ): Promise<string> {
    const query = `
      INSERT INTO email_logs (user_id, "to", subject, template, status, error_message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const result = await this.databaseService.query(query, [
      userId,
      to,
      subject,
      template || null,
      status,
      errorMessage || null,
    ]);

    return result.rows[0].id;
  }

  private async updateEmailLog(
    logId: string,
    status: EmailStatus,
    errorMessage?: string,
    sentAt?: Date,
  ): Promise<void> {
    const query = `
      UPDATE email_logs
      SET status = $2, error_message = $3, sent_at = $4, updated_at = NOW()
      WHERE id = $1
    `;

    await this.databaseService.query(query, [
      logId,
      status,
      errorMessage || null,
      sentAt || null,
    ]);
  }

  async getEmailLogs(userId: string, limit = 50, offset = 0) {
    const query = `
      SELECT id, user_id, "to", subject, template, status, error_message, sent_at, created_at
      FROM email_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await this.databaseService.query(query, [
      userId,
      limit,
      offset,
    ]);
    return result.rows;
  }

  async getEmailLogById(logId: string, userId: string) {
    const query = `
      SELECT id, user_id, "to", subject, template, status, error_message, sent_at, created_at
      FROM email_logs
      WHERE id = $1 AND user_id = $2
    `;

    const result = await this.databaseService.query(query, [logId, userId]);
    return result.rows[0] || null;
  }

  async sendTeamInvitationEmail(
    userId: string,
    inviteeEmail: string,
    inviteeName: string,
    teamName: string,
    teamDescription: string,
    inviterName: string,
    inviterEmail: string,
    role: string,
    teamId: string,
    memberId: string,
  ): Promise<SendEmailResult> {
    try {
      const baseUrl = this.configService.get<string>(
        'FRONTEND_URL',
        'https://calento.space',
      );
      const acceptUrl = `${baseUrl}/dashboard/teams/${teamId}`;

      const context = {
        inviteeName,
        inviteeEmail,
        teamName,
        teamDescription,
        inviterName,
        inviterEmail,
        role,
        acceptUrl,
        baseUrl,
        invitedAt: new Date(),
        year: new Date().getFullYear(),
      };

      return await this.sendEmail(
        {
          to: inviteeEmail,
          subject: `You've been invited to join ${teamName} on Tempra`,
          template: 'team-invitation',
          context,
        },
        userId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send team invitation email to ${inviteeEmail}`,
      );
      this.logger.error(error);
      throw error;
    }
  }
}
