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
        register_success: 'Registration successful',
        registration_failed: 'Registration failed',
        google_login_success: 'Google login successful',
        token_expired: 'Token has expired',
        token_refresh_success: 'Token refreshed successfully',
        profile_retrieved: 'Profile retrieved successfully',
        forget_password_success: 'Password reset email sent',
        reset_password_success: 'Password reset successful',
        invalid_credentials: 'Invalid credentials',
        account_locked: 'Account is locked',
        password_reset_sent: 'Password reset email sent',
        password_changed: 'Password changed successfully',
        email_verification_sent: 'Email verification sent',
        email_verified: 'Email verified successfully',
        duplicate_email: 'Email already exists',
        duplicate_username: 'Username already exists',
        authenticated: 'Authentication verified',
        not_authenticated: 'Not authenticated',
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
        link_created: 'Booking link created successfully',
        link_updated: 'Booking link updated successfully',
        link_deleted: 'Booking link deleted successfully',
        link_retrieved: 'Booking link retrieved successfully',
        links_retrieved: 'Booking links retrieved successfully',
        link_not_found: 'Booking link with ID {{id}} not found',
        link_slug_not_found: 'Booking link with slug {{slug}} not found',
        slug_exists: 'Booking link slug {{slug}} already exists',
        link_inactive: 'Booking link is not active',
        created: 'Booking created successfully',
        updated: 'Booking updated successfully',
        cancelled: 'Booking cancelled successfully',
        rescheduled: 'Booking rescheduled successfully',
        retrieved: 'Booking retrieved successfully',
        bookings_retrieved: 'Bookings retrieved successfully',
        not_found: 'Booking with ID {{id}} not found',
        time_unavailable: 'Selected time slot is not available',
        past_date: 'Cannot book for past dates',
        advance_notice:
          'Booking requires at least {{hours}} hours advance notice',
        outside_window: 'Booking must be within {{days}} days',
        daily_limit: 'Daily booking limit of {{limit}} reached for this day',
        already_cancelled: 'Booking is already cancelled',
        cannot_cancel: 'Cannot cancel booking',
        slots_retrieved: 'Available booking slots retrieved successfully',
        stats_retrieved: 'Booking statistics retrieved successfully',
      },
      notification: {
        sent: 'Notification sent successfully',
        failed: 'Failed to send notification',
        email_sent: 'Email notification sent',
        slack_sent: 'Slack notification sent',
      },
      availability: {
        created: 'Availability rule created successfully',
        updated: 'Availability rule updated successfully',
        deleted: 'Availability rule deleted successfully',
        retrieved: 'Availability rules retrieved successfully',
        not_found: 'Availability rule with ID {{id}} not found',
        no_rules_found: 'No availability rules found for user {{userId}}',
        invalid_time_range:
          'Invalid time range: start_time ({{startTime}}) must be before end_time ({{endTime}})',
        overlapping:
          'Overlapping availability rule detected for day {{dayOfWeek}}',
        creation_failed: 'Failed to create availability rule: {{message}}',
        invalid_date_range: 'Invalid date range provided',
        user_not_available:
          'User is not available at the requested time: {{datetime}}',
        check_success: 'Availability check completed',
        slots_retrieved: 'Available slots retrieved successfully',
        bulk_created: '{{count}} availability rules created successfully',
        bulk_deleted: '{{count}} availability rules deleted successfully',
        default_rules_created:
          'Default availability rules created successfully (Mon-Fri, 9 AM - 5 PM)',
      },
      google: {
        auth_url_generated: 'Google OAuth URL generated successfully',
        connection_success: 'Google Calendar connected successfully',
        connection_failed: 'Failed to connect Google Calendar',
        disconnection_success: 'Google Calendar disconnected successfully',
        token_refresh_success: 'Google token refreshed successfully',
        token_refresh_failed: 'Failed to refresh Google token',
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
        authenticated: 'Xác thực thành công',
        not_authenticated: 'Chưa xác thực',
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
        link_created: 'Tạo liên kết đặt lịch thành công',
        link_updated: 'Cập nhật liên kết đặt lịch thành công',
        link_deleted: 'Xóa liên kết đặt lịch thành công',
        link_retrieved: 'Lấy liên kết đặt lịch thành công',
        links_retrieved: 'Lấy danh sách liên kết đặt lịch thành công',
        link_not_found: 'Không tìm thấy liên kết đặt lịch với ID {{id}}',
        link_slug_not_found:
          'Không tìm thấy liên kết đặt lịch với slug {{slug}}',
        slug_exists: 'Slug liên kết đặt lịch {{slug}} đã tồn tại',
        link_inactive: 'Liên kết đặt lịch không hoạt động',
        created: 'Tạo đặt lịch thành công',
        updated: 'Cập nhật đặt lịch thành công',
        cancelled: 'Hủy đặt lịch thành công',
        rescheduled: 'Đổi lịch thành công',
        retrieved: 'Lấy đặt lịch thành công',
        bookings_retrieved: 'Lấy danh sách đặt lịch thành công',
        not_found: 'Không tìm thấy đặt lịch với ID {{id}}',
        time_unavailable: 'Khoảng thời gian đã chọn không khả dụng',
        past_date: 'Không thể đặt lịch cho ngày đã qua',
        advance_notice: 'Đặt lịch yêu cầu ít nhất {{hours}} giờ trước',
        outside_window: 'Đặt lịch phải trong vòng {{days}} ngày',
        daily_limit: 'Đã đạt giới hạn {{limit}} đặt lịch mỗi ngày',
        already_cancelled: 'Đặt lịch đã bị hủy',
        cannot_cancel: 'Không thể hủy đặt lịch',
        slots_retrieved: 'Lấy khoảng thời gian khả dụng thành công',
        stats_retrieved: 'Lấy thống kê đặt lịch thành công',
      },
      notification: {
        sent: 'Gửi thông báo thành công',
        failed: 'Gửi thông báo thất bại',
        email_sent: 'Gửi email thông báo thành công',
        slack_sent: 'Gửi thông báo Slack thành công',
      },
      availability: {
        created: 'Tạo quy tắc lịch trống thành công',
        updated: 'Cập nhật quy tắc lịch trống thành công',
        deleted: 'Xóa quy tắc lịch trống thành công',
        retrieved: 'Lấy quy tắc lịch trống thành công',
        not_found: 'Không tìm thấy quy tắc lịch trống với ID {{id}}',
        no_rules_found:
          'Không tìm thấy quy tắc lịch trống cho người dùng {{userId}}',
        invalid_time_range:
          'Khoảng thời gian không hợp lệ: start_time ({{startTime}}) phải trước end_time ({{endTime}})',
        overlapping:
          'Phát hiện quy tắc lịch trống trùng lặp cho ngày {{dayOfWeek}}',
        creation_failed: 'Tạo quy tắc lịch trống thất bại: {{message}}',
        invalid_date_range: 'Khoảng ngày không hợp lệ',
        user_not_available:
          'Người dùng không rảnh vào thời gian yêu cầu: {{datetime}}',
        check_success: 'Kiểm tra lịch trống hoàn tất',
        slots_retrieved: 'Lấy khoảng thời gian trống thành công',
        bulk_created: 'Đã tạo {{count}} quy tắc lịch trống thành công',
        bulk_deleted: 'Đã xóa {{count}} quy tắc lịch trống thành công',
      },
    });
  }

  get(key: string, locale?: string, params?: Record<string, any>): string {
    const targetLocale = locale || this.defaultLocale;
    const messages =
      this.messages.get(targetLocale) || this.messages.get(this.defaultLocale);

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
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}
