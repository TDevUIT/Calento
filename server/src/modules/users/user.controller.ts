import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
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
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

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
  @ApiOperation({
    summary: '👤 Create a new user',
    description:
      'Create a new user account - Public endpoint for initial setup',
  })
  @ApiResponse({
    status: 201,
    description: '✅ User created successfully',
    schema: {
      example: SwaggerExamples.Users.Create.response,
    },
  })
  @ApiResponse({
    status: 400,
    description: '❌ Validation failed - Invalid input data',
    schema: {
      example: SwaggerExamples.Errors.ValidationError,
    },
  })
  @ApiResponse({
    status: 409,
    description: '❌ Conflict - Email or username already exists',
    schema: {
      example: {
        success: false,
        error: 'Conflict',
        message: 'Email already exists',
        statusCode: 409,
      },
    },
  })
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
  @ApiOperation({
    summary: '👥 Get all users with pagination',
    description: 'Retrieve paginated list of users with search and filtering',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Users retrieved successfully with pagination',
    schema: {
      example: SwaggerExamples.Users.List.response,
    },
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
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
  @ApiOperation({ summary: 'Search users by email or username' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Deactivate user (soft delete)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Delete user permanently' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
