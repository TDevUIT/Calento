import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes as having optional authentication
 * If token is provided, it will be validated, but routes work without token
 */
export const OptionalAuth = () => SetMetadata('isOptionalAuth', true);
