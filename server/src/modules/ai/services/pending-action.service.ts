import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIActionRepository } from '../repositories/ai-action.repository';
import { AIAction } from '../interfaces/ai.interface';

@Injectable()
export class PendingActionService {
    private readonly logger = new Logger(PendingActionService.name);

    constructor(private readonly actionRepository: AIActionRepository) { }

    async createPendingAction(
        conversationId: string,
        toolName: string,
        args: Record<string, any>,
        requiresConfirmation: boolean = true,
    ): Promise<AIAction> {
        return this.actionRepository.create(
            conversationId,
            toolName,
            args,
            requiresConfirmation,
        );
    }

    async confirmPendingAction(
        actionId: string,
        modifiedParameters?: Record<string, any>,
    ): Promise<AIAction> {
        const action = await this.actionRepository.findById(actionId);
        if (!action) {
            throw new NotFoundException(`Action ${actionId} not found`);
        }

        if (action.confirmation_status !== 'awaiting_confirmation') {
            throw new Error(`Action ${actionId} is not awaiting confirmation`);
        }

        if (modifiedParameters && Object.keys(modifiedParameters).length > 0) {
            this.logger.log(`Action ${actionId} confirmed with modified parameters`);
        }

        return this.actionRepository.updateConfirmationStatus(actionId, 'confirmed');
    }

    async rejectPendingAction(actionId: string): Promise<AIAction> {
        const action = await this.actionRepository.findById(actionId);
        if (!action) {
            throw new NotFoundException(`Action ${actionId} not found`);
        }

        if (action.confirmation_status !== 'awaiting_confirmation') {
            throw new Error(`Action ${actionId} is not awaiting confirmation`);
        }

        return this.actionRepository.updateConfirmationStatus(actionId, 'rejected');
    }

    async getPendingAction(actionId: string): Promise<AIAction> {
        const action = await this.actionRepository.findById(actionId);
        if (!action) {
            throw new NotFoundException(`Action ${actionId} not found`);
        }
        return action;
    }
}
