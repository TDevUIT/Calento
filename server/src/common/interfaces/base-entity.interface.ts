export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserOwnedEntity extends BaseEntity {
  user_id: string;
}

export interface SoftDeletableEntity extends BaseEntity {
  deleted_at?: Date;
  is_deleted?: boolean;
}

export interface StatusEntity extends BaseEntity {
  is_active: boolean;
}

export interface AuditableEntity extends BaseEntity {
  created_by?: string;
  updated_by?: string;
}
