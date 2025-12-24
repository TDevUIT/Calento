import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserSettingsRepository } from './user-settings.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserSettingsRepository],
  exports: [UserService, UserRepository, UserSettingsRepository],
})
export class UsersModule {}
