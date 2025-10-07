import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { MessageService } from "../message/message.service";
import { BlogCategoryNotFoundException } from "src/modules/blog/exceptions/blog.exceptions";
import { Logger } from "@nestjs/common";


@Injectable()
export class CategoryValidationService {
    private readonly logger = new Logger(CategoryValidationService.name);
    constructor(
        private databaseService: DatabaseService,
        private messageService: MessageService
    ) {}

    async validateCategoryExists(categoryId: string): Promise<void> {
        const categoryQuery = 'SELECT * FROM categories WHERE id = $1';
        const categoryParams = [categoryId];

        try {
            const categoryResult = await this.databaseService.query(categoryQuery, categoryParams);
            if (categoryResult.rows.length === 0) {
                throw new BlogCategoryNotFoundException(this.messageService.get('error.category_not_found'));
            }
        } catch (error) {
            this.logger.error('Failed to validate category:', error);
            throw new BlogCategoryNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async validateCategoryNotExists(categoryId: string): Promise<void> {
        const categoryQuery = 'SELECT * FROM categories WHERE id = $1';
        const categoryParams = [categoryId];

        try {
            const categoryResult = await this.databaseService.query(categoryQuery, categoryParams);
            if (categoryResult.rows.length > 0) {
                throw new BlogCategoryNotFoundException(this.messageService.get('error.category_not_found'));
            }
        } catch (error) {
            this.logger.error('Failed to validate category:', error);
            throw new BlogCategoryNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    
}   