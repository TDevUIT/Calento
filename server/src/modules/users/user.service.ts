import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async getUsers(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.getAllUsers(paginationOptions);
  }

  async searchUsers(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.searchUsers(searchTerm, paginationOptions);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async deactivateUser(id: string): Promise<boolean> {
    return this.userRepository.deactivateUser(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async userExists(id: string): Promise<boolean> {
    return this.userRepository.exists(id);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User | null> {
    return this.userRepository.updateUser(userId, { avatar: avatarUrl });
  }

  async removeAvatar(userId: string): Promise<User | null> {
    return this.userRepository.updateUser(userId, { avatar: null });
  }
}
