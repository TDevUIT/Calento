import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { AddContextDto } from './dto/add-context.dto';

@ApiTags('RAG')
@ApiBearerAuth()
@Controller('rag')
@UseGuards(JwtAuthGuard)
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('context')
  @ApiOperation({ summary: 'Add user context for RAG' })
  async addContext(@Request() req, @Body() dto: AddContextDto) {
    const userId = req.user.id;
    const result = await this.ragService.addUserContext(userId, dto.context);
    return {
      success: true,
      data: result,
    };
  }

  @Get('contexts')
  @ApiOperation({ summary: 'Get user contexts' })
  async getContexts(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user.id;
    const contexts = await this.ragService.getUserContexts(userId, limit || 10);
    return {
      success: true,
      data: contexts,
    };
  }

  @Delete('context/:id')
  @ApiOperation({ summary: 'Delete user context' })
  async deleteContext(@Request() req, @Param('id') contextId: string) {
    const userId = req.user.id;
    await this.ragService.deleteUserContext(userId, contextId);
    return {
      success: true,
      message: 'Context deleted successfully',
    };
  }
}
