# PostgreSQL Database Setup

## 📋 Prerequisites

1. **Install PostgreSQL packages:**
   ```bash
   npm install pg
   npm install --save-dev @types/pg
   ```

2. **Install PostgreSQL server** (if not already installed)
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

## 🔧 Configuration

1. **Create .env file** from the sample:
   ```bash
   cp .env.sample .env
   ```

2. **Update database credentials** in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=tempra_db
   ```

3. **Create database:**
   ```sql
   CREATE DATABASE tempra_db;
   ```

## 🚀 Usage

### Running Migrations

```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Generate new migration
npm run migrate:generate create_posts_table
```

### Database Service

The `DatabaseService` provides:

- **Connection pooling** for better performance
- **Transaction support** for data consistency
- **Health checks** for monitoring
- **Query logging** for debugging

```typescript
import { DatabaseService } from './database/database.service';

// Simple query
const result = await databaseService.query('SELECT * FROM users WHERE id = $1', [userId]);

// Transaction
await databaseService.transaction(async (client) => {
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO profiles ...');
});
```

### Repository Pattern

Use repositories for data access:

```typescript
import { UserRepository } from './users/user.repository';

// Create user
const user = await userRepository.create({
  email: 'user@example.com',
  username: 'johndoe',
  password_hash: 'hashed_password'
});

// Find user
const user = await userRepository.findByEmail('user@example.com');

// Update user
await userRepository.update(userId, { first_name: 'John' });
```

## 📁 File Structure

```
src/
├── database/
│   ├── database.service.ts     # Core database service
│   ├── database.module.ts      # Database module
│   └── migration.service.ts    # Migration management
├── users/
│   ├── user.entity.ts          # User interfaces
│   ├── user.repository.ts      # User data access
│   └── users.module.ts         # Users module
├── cli/
│   └── migrate.ts              # Migration CLI
└── migrations/
    └── *.sql                   # Migration files
```

## 🔄 Migration Files

Migration files use this format:

```sql
-- UP
CREATE TABLE example (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS example;
```

## 🛡️ Security Features

- **Connection pooling** with configurable limits
- **Parameterized queries** to prevent SQL injection
- **Transaction rollback** on errors
- **Connection timeout** protection
- **Query logging** for audit trails

## 📊 Monitoring

Check database health:

```typescript
const isHealthy = await databaseService.healthCheck();
const stats = await databaseService.getStats();
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check PostgreSQL is running
   - Verify host/port in .env
   - Check firewall settings

2. **Authentication failed:**
   - Verify username/password
   - Check pg_hba.conf settings

3. **Database does not exist:**
   - Create database manually
   - Check database name in .env

4. **Migration errors:**
   - Check SQL syntax
   - Verify table dependencies
   - Review migration order

### Debug Mode

Enable query logging by setting `LOG_LEVEL=debug` in your `.env` file.

## 🔗 Related Documentation

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)
