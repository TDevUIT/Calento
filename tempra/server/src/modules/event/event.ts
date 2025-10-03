
import { UserOwnedEntity } from '../../common/interfaces/base-entity.interface';

export interface Event extends UserOwnedEntity {
    title: string;
    description?: string;
    start_time: Date;
    end_time: Date;
    location?: string;
    is_all_day: boolean;
    recurrence_rule?: string;
}