import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { MessageService } from '../../common/message/message.service';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import {
  PaginationQueryDto,
  SearchPaginationQueryDto,
} from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateUserSettingsDto } from './dto/user-settings.dto';
import {
  ApiCreateUser,
  ApiGetUsers,
  ApiSearchUsers,
  ApiGetUserSettings,
  ApiUpdateUserSettings,
  ApiGetUserById,
  ApiUpdateUserById,
  ApiDeactivateUser,
  ApiDeleteUser,
} from './user.swagger';

@ApiTags('Users')
@ApiExtraModels(
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  SuccessResponseDto,
  PaginatedResponseDto,
)
@Controller('users')
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @Public()
  @ApiCreateUser()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    const user = await this.userService.createUser(createUserDto);

    const { password_hash, ...userResponse } = user;

    return new SuccessResponseDto(
      this.messageService.get('user.created'),
      userResponse as UserResponseDto,
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiGetUsers()
  async getUsers(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const result = await this.userService.getUsers(query);

    const usersWithoutPassword = result.data.map((user) => {
      const { password_hash, ...userResponse } = user;
      return userResponse as UserResponseDto;
    });

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      usersWithoutPassword,
      result.meta,
    );
  }

  @Get('search')
  @ApiSearchUsers()
  async searchUsers(
    @Query() query: SearchPaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    if (!query.search) {
      return this.getUsers(query);
    }

    const result = await this.userService.searchUsers(query.search, query);

    const usersWithoutPassword = result.data.map((user) => {
      const { password_hash, ...userResponse } = user;
      return userResponse as UserResponseDto;
    });

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      usersWithoutPassword,
      result.meta,
    );
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiGetUserSettings()
  async getUserSettings(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto<Record<string, any>>> {
    if (!userId) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Session expired. Please login again.',
        errors: ['No valid session found'],
        timestamp: new Date().toISOString(),
        requiresLogin: true,
      });
    }

    await this.userService.ensureUserSettingsInitialized(userId);
    const settings = await this.userService.getUserSettings(userId);

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      settings,
    );
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateUserSettings()
  async updateUserSettings(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateUserSettingsDto,
  ): Promise<SuccessResponseDto<Record<string, any>>> {
    if (!userId) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Session expired. Please login again.',
        errors: ['No valid session found'],
        timestamp: new Date().toISOString(),
        requiresLogin: true,
      });
    }

    await this.userService.ensureUserSettingsInitialized(userId);
    const settings = await this.userService.updateUserSettings(
      userId,
      dto.settings,
    );

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      settings,
    );
  }

  @Get(':id')
  @ApiGetUserById()
  async getUserById(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<UserResponseDto | null>> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user;

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      userResponse as UserResponseDto,
    );
  }

  @Put(':id')
  @ApiUpdateUserById()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponseDto<UserResponseDto | null>> {
    const user = await this.userService.updateUser(id, updateUserDto);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user;

    return new SuccessResponseDto(
      this.messageService.get('user.updated'),
      userResponse as UserResponseDto,
    );
  }

  @Delete(':id/deactivate')
  @ApiDeactivateUser()
  async deactivateUser(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<boolean>> {
    const result = await this.userService.deactivateUser(id);

    return new SuccessResponseDto(
      result
        ? this.messageService.get('user.deactivated')
        : this.messageService.get('user.not_found'),
      result,
      result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Delete(':id')
  @ApiDeleteUser()
  async deleteUser(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<boolean>> {
    const result = await this.userService.deleteUser(id);

    return new SuccessResponseDto(
      result
        ? this.messageService.get('user.deleted')
        : this.messageService.get('user.not_found'),
      result,
      result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }
}
