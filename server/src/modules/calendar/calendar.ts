import { UserOwnedEntity } from '../../common/interfaces/base-entity.interface';

export interface Calendar extends UserOwnedEntity {
  google_calendar_id: string;

  name?: string;

  description?: string;

  timezone?: string;
  is_primary: boolean;
}
