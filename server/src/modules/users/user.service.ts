import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserSettingsRepository } from './user-settings.repository';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';

const DEFAULT_USER_SETTINGS: Record<string, any> = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  emailNotifications: true,
  pushNotifications: false,
  eventReminders: true,
  weeklyDigest: true,
  newFeatures: false,
  marketingEmails: false,
  twoFactorAuth: false,
  sessionTimeout: '30',
  loginAlerts: true,
  theme: 'system',
  compactMode: false,
  showWeekNumbers: false,
};

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSettingsRepository: UserSettingsRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(createUserDto);
    await this.ensureUserSettingsInitialized(user.id);
    return user;
  }

  async ensureUserSettingsInitialized(
    userId: string,
    overrides?: Record<string, any>,
  ): Promise<Record<string, any>> {
    const saved =
      await this.userSettingsRepository.findSettingsByUserId(userId);

    if (!saved) {
      const created = await this.userSettingsRepository.upsertSettingsByUserId(
        userId,
        { ...DEFAULT_USER_SETTINGS, ...(overrides ?? {}) },
      );
      return { ...DEFAULT_USER_SETTINGS, ...(created ?? {}) };
    }

    const tz = typeof saved.timezone === 'string' ? saved.timezone.trim() : '';
    if (!tz) {
      const updated = await this.userSettingsRepository.upsertSettingsByUserId(
        userId,
        {
          ...DEFAULT_USER_SETTINGS,
          ...saved,
          ...(overrides ?? {}),
          timezone: DEFAULT_USER_SETTINGS.timezone,
        },
      );
      return { ...DEFAULT_USER_SETTINGS, ...(updated ?? {}) };
    }

    return { ...DEFAULT_USER_SETTINGS, ...saved, ...(overrides ?? {}) };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async getUsers(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.getAllUsers(paginationOptions);
  }

  async searchUsers(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.searchUsers(searchTerm, paginationOptions);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async deactivateUser(id: string): Promise<boolean> {
    return this.userRepository.deactivateUser(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async userExists(id: string): Promise<boolean> {
    return this.userRepository.exists(id);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User | null> {
    return this.userRepository.updateUser(userId, { avatar: avatarUrl });
  }

  async removeAvatar(userId: string): Promise<User | null> {
    return this.userRepository.updateUser(userId, { avatar: null });
  }

  async getUserSettings(userId: string): Promise<Record<string, any>> {
    const saved =
      await this.userSettingsRepository.findSettingsByUserId(userId);
    return { ...DEFAULT_USER_SETTINGS, ...(saved ?? {}) };
  }

  async updateUserSettings(
    userId: string,
    settings: Record<string, any>,
  ): Promise<Record<string, any>> {
    const existing = await this.getUserSettings(userId);
    const merged = { ...existing, ...(settings ?? {}) };
    const stored = await this.userSettingsRepository.upsertSettingsByUserId(
      userId,
      merged,
    );
    return { ...DEFAULT_USER_SETTINGS, ...(stored ?? {}) };
  }

  async getUserTimezone(userId: string): Promise<string> {
    const settings = await this.getUserSettings(userId);
    const tz =
      typeof settings.timezone === 'string' ? settings.timezone.trim() : '';
    return tz || DEFAULT_USER_SETTINGS.timezone;
  }
}
