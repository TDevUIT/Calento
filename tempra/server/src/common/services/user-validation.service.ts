import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class UserValidationService {
    constructor(
        private databaseService: DatabaseService,
        private messageService: MessageService
    ) {}

    async validateUserExists(userId: string): Promise<void> {
        const query = 'SELECT id FROM users WHERE id = $1';
        const params = [userId];

        try {
            const result = await this.databaseService.query(query, params);
            if (result.rows.length === 0) {
                throw new Error(this.messageService.get('user.not_found'));
            }
        } catch (error) {
            if (error.message === this.messageService.get('user.not_found')) {
                throw error;
            }
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async validateAndGetUser(userId: string): Promise<any> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const params = [userId];

        try {
            const result = await this.databaseService.query(query, params);
            if (result.rows.length === 0) {
                throw new Error(this.messageService.get('user.not_found'));
            }
            return result.rows[0];
        } catch (error) {
            if (error.message === this.messageService.get('user.not_found')) {
                throw error;
            }
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async validateMultipleUsers(userIds: string[]): Promise<string[]> {
        if (userIds.length === 0) {
            return [];
        }

        const placeholders = userIds.map((_, index) => `$${index + 1}`).join(', ');
        const query = `SELECT id FROM users WHERE id IN (${placeholders})`;

        try {
            const result = await this.databaseService.query(query, userIds);
            return result.rows.map(row => row.id);
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async userExists(userId: string): Promise<boolean> {
        const query = 'SELECT 1 FROM users WHERE id = $1 LIMIT 1';
        const params = [userId];

        try {
            const result = await this.databaseService.query(query, params);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async emailExists(email: string): Promise<boolean> {
        const query = 'SELECT 1 FROM users WHERE email = $1 LIMIT 1';
        const params = [email];

        try {
            const result = await this.databaseService.query(query, params);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async usernameExists(username: string): Promise<boolean> {
        const query = 'SELECT 1 FROM users WHERE username = $1 LIMIT 1';
        const params = [username];

        try {
            const result = await this.databaseService.query(query, params);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async validateUserUniqueness(email: string, username: string, excludeUserId?: string): Promise<{ emailExists: boolean; usernameExists: boolean }> {
        let emailQuery = 'SELECT 1 FROM users WHERE email = $1';
        let usernameQuery = 'SELECT 1 FROM users WHERE username = $1';
        let emailParams = [email];
        let usernameParams = [username];

        if (excludeUserId) {
            emailQuery += ' AND id != $2';
            usernameQuery += ' AND id != $2';
            emailParams.push(excludeUserId);
            usernameParams.push(excludeUserId);
        }

        emailQuery += ' LIMIT 1';
        usernameQuery += ' LIMIT 1';

        try {
            const [emailResult, usernameResult] = await Promise.all([
                this.databaseService.query(emailQuery, emailParams),
                this.databaseService.query(usernameQuery, usernameParams)
            ]);

            return {
                emailExists: emailResult.rows.length > 0,
                usernameExists: usernameResult.rows.length > 0
            };
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async findUserByEmail(email: string): Promise<any | null> {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
        const params = [email];

        try {
            const result = await this.databaseService.query(query, params);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }

    async findUserByUsername(username: string): Promise<any | null> {
        const query = 'SELECT * FROM users WHERE username = $1 AND is_active = true';
        const params = [username];

        try {
            const result = await this.databaseService.query(query, params);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(this.messageService.get('error.internal_server_error'));
        }
    }
}
