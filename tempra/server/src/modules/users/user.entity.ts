export interface User {
  id: string; // UUID
  email: string; // VARCHAR(255) UNIQUE NOT NULL
  username: string; // VARCHAR(100) UNIQUE NOT NULL
  avatar?: string | null; // VARCHAR(255) DEFAULT NULL
  password_hash: string; // VARCHAR(255) NOT NULL
  first_name?: string; // VARCHAR(100)
  last_name?: string; // VARCHAR(100)
  is_active: boolean; // BOOLEAN DEFAULT true NOT NULL
  is_verified: boolean; // BOOLEAN DEFAULT false NOT NULL
  created_at: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  updated_at: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
}

