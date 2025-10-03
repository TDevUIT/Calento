import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'api_version';

export const ApiVersion = (version: string) => SetMetadata(API_VERSION_KEY, version);

// Usage example:
// @ApiVersion('v1')
// @Controller('users')
// export class UsersV1Controller { ... }

// @ApiVersion('v2') 
// @Controller('users')
// export class UsersV2Controller { ... }
