import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import { MessageService } from '../../common/message/message.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { BaseRepository } from '../../common/repositories/base.repository';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import {
  UserCreationFailedException,
  UserUpdateFailedException,
  DuplicateUserException,
} from './exceptions/user.exceptions';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    databaseService: DatabaseService,
    paginationService: PaginationService,
    messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'users');
  }

  protected getAllowedSortFields(): string[] {
    return ['created_at', 'updated_at', 'email', 'username'];
  }

  protected buildSelectQuery(includeDeleted = false): string {
    let query = `SELECT * FROM ${this.tableName}`;
    if (!includeDeleted) {
      query += ` WHERE is_active = true`;
    }
    return query;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const existingEmail = await this.findByEmail(userData.email);
    if (existingEmail) {
      throw new DuplicateUserException('email', userData.email);
    }

    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) {
      throw new DuplicateUserException('username', userData.username);
    }

    const userEntity: Partial<User> = {
      email: userData.email,
      username: userData.username,
      password_hash: userData.password_hash,
      first_name: userData.first_name,
      last_name: userData.last_name,
      is_active: true,
      is_verified: false,
    };

    try {
      return await this.create(userEntity);
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw new UserCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    try {
      const result = await this.databaseService.query<User>(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Failed to find user by email ${email}:`, error);
      throw new UserCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const query =
      'SELECT * FROM users WHERE username = $1 AND is_active = true';

    try {
      const result = await this.databaseService.query<User>(query, [username]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Failed to find user by username ${username}:`, error);
      throw new UserCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      return await this.update(id, userData);
    } catch (error) {
      this.logger.error(`Failed to update user ${id}:`, error);
      throw new UserUpdateFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async deactivateUser(id: string): Promise<boolean> {
    const updateData: Partial<User> = { is_active: false };

    try {
      const result = await this.update(id, updateData);
      return result !== null;
    } catch (error) {
      this.logger.error(`Failed to deactivate user ${id}:`, error);
      throw new UserUpdateFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async getAllUsers(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    try {
      return await this.findAll(paginationOptions);
    } catch (error) {
      this.logger.error('Failed to get all users:', error);
      throw new UserCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async searchUsers(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    const searchPattern = `%${searchTerm}%`;
    const whereCondition =
      'is_active = true AND (email ILIKE $1 OR username ILIKE $1)';
    const whereParams = [searchPattern];

    try {
      return await this.search(whereCondition, whereParams, paginationOptions);
    } catch (error) {
      this.logger.error('Failed to search users:', error);
      throw new UserCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }
}
