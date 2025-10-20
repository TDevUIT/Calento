import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserValidationService } from '../../common/services/user-validation.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import {
  AuthCreationFailedException,
  UserNotFoundException,
  DatabaseOperationException,
} from './exceptions/auth.exceptions';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userValidationService: UserValidationService,
  ) {}

  async createUser(
    userData: RegisterDto & { password_hash: string },
  ): Promise<User> {
    try {
      const query = `
        INSERT INTO users (email, username, avatar, password_hash, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        userData.email,
        userData.username,
        userData.avatar || null,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        false,
      ];

      const result = await this.databaseService.query(query, values);

      if (!result.rows || result.rows.length === 0) {
        throw new AuthCreationFailedException('Failed to create user account');
      }

      this.logger.log(`User created successfully: ${userData.email}`);
      return result.rows[0] as User;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);

      if (error instanceof AuthCreationFailedException) {
        throw error;
      }

      if (error.code === '23505') {
        if (error.constraint?.includes('email')) {
          throw new AuthCreationFailedException('Email already exists');
        }
        if (error.constraint?.includes('username')) {
          throw new AuthCreationFailedException('Username already exists');
        }
      }

      throw new DatabaseOperationException(
        'Database error during user creation',
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userValidationService.findUserByEmail(email);
    } catch (error) {
      this.logger.error(
        `Failed to find user by email: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException('Database error during user lookup');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userValidationService.findUserByUsername(username);
    } catch (error) {
      this.logger.error(
        `Failed to find user by username: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException('Database error during user lookup');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM users 
        WHERE id = $1 AND is_active = true
      `;

      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(
        `Failed to find user by ID: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException('Database error during user lookup');
    }
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    try {
      const query = `
        UPDATE users 
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND is_active = true
      `;

      const result = await this.databaseService.query(query, [
        passwordHash,
        userId,
      ]);

      if (result.rowCount === 0) {
        throw new UserNotFoundException();
      }

      this.logger.log(`Password updated for user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update password: ${error.message}`,
        error.stack,
      );

      if (error instanceof UserNotFoundException) {
        throw error;
      }

      throw new DatabaseOperationException(
        'Database error during password update',
      );
    }
  }

  async verifyEmail(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE users 
        SET is_verified = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND is_active = true
      `;

      const result = await this.databaseService.query(query, [userId]);

      if (result.rowCount === 0) {
        throw new UserNotFoundException();
      }

      this.logger.log(`Email verified for user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to verify email: ${error.message}`,
        error.stack,
      );

      if (error instanceof UserNotFoundException) {
        throw error;
      }

      throw new DatabaseOperationException(
        'Database error during email verification',
      );
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE users 
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND is_active = true
      `;

      await this.databaseService.query(query, [userId]);
      this.logger.log(`Last login updated for user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update last login: ${error.message}`,
        error.stack,
      );
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      return await this.userValidationService.emailExists(email);
    } catch (error) {
      this.logger.error(
        `Failed to check email existence: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException('Database error during email check');
    }
  }

  async updateResetToken(
    userId: string,
    identifier: string,
    hashedSecret: string,
    expiresAt: Date,
  ) {
    const query = `
        UPDATE users 
        SET reset_token_identifier = $1, reset_token_secret = $2, reset_token_expires_at = $3
        WHERE id = $4 AND is_active = true
      `;
    try {
      await this.databaseService.query(query, [
        identifier,
        hashedSecret,
        expiresAt,
        userId,
      ]);
      this.logger.log(`Reset token updated for user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update reset token: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException(
        'Database error during reset token update',
      );
    }
  }

  async usernameExists(username: string): Promise<boolean> {
    try {
      return await this.userValidationService.usernameExists(username);
    } catch (error) {
      this.logger.error(
        `Failed to check username existence: ${error.message}`,
        error.stack,
      );
      throw new DatabaseOperationException(
        'Database error during username check',
      );
    }
  }
}
