import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export type ProviderType = 'google' | 'outlook' | 'apple';

export interface UserCredentials extends BaseEntity {
  user_id: string;
  provider: ProviderType;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  scope?: string;
}
