import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MessageTranslations {
  [key: string]: string | MessageTranslations;
}

@Injectable()
export class MessageService {
    private readonly defaultLocale = 'en';
    private readonly messages: Map<string, MessageTranslations> = new Map();

    constructor(private readonly configService: ConfigService) {
        this.loadMessages();
    }

    private loadMessages(): void {
        this.messages.set('en', {
        error: {
            internal_server_error: 'Internal server error occurred',
            bad_request: 'Bad request',
            unauthorized: 'Unauthorized access',
            forbidden: 'Access forbidden',
            not_found: 'Resource not found',
            conflict: 'Resource conflict',
            unprocessable_entity: 'Unprocessable entity',
            validation_failed: 'Validation failed',
            rate_limit_exceeded: 'Rate limit exceeded',
            service_unavailable: 'Service temporarily unavailable',
        },
        success: {
            created: 'Resource created successfully',
            updated: 'Resource updated successfully',
            deleted: 'Resource deleted successfully',
            retrieved: 'Resource retrieved successfully',
        },
        auth: {
            login_success: 'Login successful',
            login_failed: 'Login failed',
            logout_success: 'Logout successful',
            registration_failed: 'Registration failed',
            token_expired: 'Token has expired',
            invalid_credentials: 'Invalid credentials',
            account_locked: 'Account is locked',
            password_reset_sent: 'Password reset email sent',
            password_changed: 'Password changed successfully',
            email_verification_sent: 'Email verification sent',
            email_verified: 'Email verified successfully',
            duplicate_email: 'Email already exists',
            duplicate_username: 'Username already exists',
        },
        user: {
            not_found: 'User not found',
            already_exists: 'User already exists',
            profile_updated: 'Profile updated successfully',
            email_verified: 'Email verified successfully',
            email_already_verified: 'Email is already verified',
        },
        calendar: {
            event_created: 'Calendar event created successfully',
            event_updated: 'Calendar event updated successfully',
            event_deleted: 'Calendar event deleted successfully',
            event_not_found: 'Calendar event not found',
            sync_success: 'Calendar synchronized successfully',
            sync_failed: 'Calendar synchronization failed',
        },
        booking: {
            created: 'Booking created successfully',
            updated: 'Booking updated successfully',
            cancelled: 'Booking cancelled successfully',
            not_found: 'Booking not found',
            conflict: 'Booking time conflict',
            past_date: 'Cannot book for past dates',
        },
        notification: {
            sent: 'Notification sent successfully',
            failed: 'Failed to send notification',
            email_sent: 'Email notification sent',
            slack_sent: 'Slack notification sent',
        },
        availability: {
            updated: 'Availability updated successfully',
            not_found: 'Availability not found',
            invalid_time_range: 'Invalid time range',
        },
        });

        this.messages.set('vi', {
        error: {
            internal_server_error: 'Đã xảy ra lỗi máy chủ nội bộ',
            bad_request: 'Yêu cầu không hợp lệ',
            unauthorized: 'Truy cập không được phép',
            forbidden: 'Truy cập bị cấm',
            not_found: 'Không tìm thấy tài nguyên',
            conflict: 'Xung đột tài nguyên',
            unprocessable_entity: 'Thực thể không thể xử lý',
            validation_failed: 'Xác thực thất bại',
            rate_limit_exceeded: 'Vượt quá giới hạn tốc độ',
            service_unavailable: 'Dịch vụ tạm thời không khả dụng',
        },
        success: {
            created: 'Tạo tài nguyên thành công',
            updated: 'Cập nhật tài nguyên thành công',
            deleted: 'Xóa tài nguyên thành công',
            retrieved: 'Lấy tài nguyên thành công',
        },
        auth: {
            login_success: 'Đăng nhập thành công',
            login_failed: 'Đăng nhập thất bại',
            logout_success: 'Đăng xuất thành công',
            registration_failed: 'Đăng ký thất bại',
            token_expired: 'Token đã hết hạn',
            invalid_credentials: 'Thông tin đăng nhập không hợp lệ',
            account_locked: 'Tài khoản bị khóa',
            password_reset_sent: 'Email đặt lại mật khẩu đã được gửi',
            password_changed: 'Đổi mật khẩu thành công',
            email_verification_sent: 'Email xác thực đã được gửi',
            email_verified: 'Xác thực email thành công',
            duplicate_email: 'Email đã tồn tại',
            duplicate_username: 'Tên người dùng đã tồn tại',
        },
        user: {
            not_found: 'Không tìm thấy người dùng',
            already_exists: 'Người dùng đã tồn tại',
            profile_updated: 'Cập nhật hồ sơ thành công',
            email_verified: 'Xác thực email thành công',
            email_already_verified: 'Email đã được xác thực',
        },
        calendar: {
            event_created: 'Tạo sự kiện lịch thành công',
            event_updated: 'Cập nhật sự kiện lịch thành công',
            event_deleted: 'Xóa sự kiện lịch thành công',
            event_not_found: 'Không tìm thấy sự kiện lịch',
            sync_success: 'Đồng bộ lịch thành công',
            sync_failed: 'Đồng bộ lịch thất bại',
        },
        booking: {
            created: 'Tạo đặt lịch thành công',
            updated: 'Cập nhật đặt lịch thành công',
            cancelled: 'Hủy đặt lịch thành công',
            not_found: 'Không tìm thấy đặt lịch',
            conflict: 'Xung đột thời gian đặt lịch',
            past_date: 'Không thể đặt lịch cho ngày đã qua',
        },
        notification: {
            sent: 'Gửi thông báo thành công',
            failed: 'Gửi thông báo thất bại',
            email_sent: 'Gửi email thông báo thành công',
            slack_sent: 'Gửi thông báo Slack thành công',
        },
        availability: {
            updated: 'Cập nhật lịch trống thành công',
            not_found: 'Không tìm thấy lịch trống',
            invalid_time_range: 'Khoảng thời gian không hợp lệ',
        },
        });
    }

    get(key: string, locale?: string, params?: Record<string, any>): string {
        const targetLocale = locale || this.defaultLocale;
        const messages = this.messages.get(targetLocale) || this.messages.get(this.defaultLocale);
        
        if (!messages) {
        return key;
        }

        const message = this.getNestedValue(messages, key);
        
        if (typeof message !== 'string') {
        return key;
        }

        return this.interpolate(message, params);
    }

    private getNestedValue(obj: MessageTranslations, path: string): any {
        return path.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
    }

    private interpolate(message: string, params?: Record<string, any>): string {
        if (!params) {
        return message;
        }

        return message.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return params[key] !== undefined ? String(params[key]) : match;
        });
    }

    getAllMessages(locale?: string): MessageTranslations | undefined {
        const targetLocale = locale || this.defaultLocale;
        return this.messages.get(targetLocale);
    }

    getSupportedLocales(): string[] {
        return Array.from(this.messages.keys());
    }

    addMessages(locale: string, messages: MessageTranslations): void {
        const existingMessages = this.messages.get(locale) || {};
        this.messages.set(locale, this.mergeDeep(existingMessages, messages));
    }

    private mergeDeep(target: any, source: any): any {
        const result = { ...target };
        
        for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = this.mergeDeep(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
        }
        
        return result;
    }
}
