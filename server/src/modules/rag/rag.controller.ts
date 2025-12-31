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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AddContextDto } from './dto/add-context.dto';
import {
  ApiAddContext,
  ApiGetContexts,
  ApiDeleteContext,
} from './rag.swagger';

@ApiTags('RAG')
@ApiBearerAuth()
@Controller('rag')
@UseGuards(JwtAuthGuard)
export class RagController {
  constructor(private readonly ragService: RagService) { }

  @Post('context')
  @ApiAddContext()
  async addContext(@Request() req, @Body() dto: AddContextDto) {
    const userId = req.user.id;
    const result = await this.ragService.addUserContext(userId, dto.context);
    return {
      success: true,
      data: result,
    };
  }

  @Get('contexts')
  @ApiGetContexts()
  async getContexts(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user.id;
    const contexts = await this.ragService.getUserContexts(userId, limit || 10);
    return {
      success: true,
      data: contexts,
    };
  }

  @Delete('context/:id')
  @ApiDeleteContext()
  async deleteContext(@Request() req, @Param('id') contextId: string) {
    const userId = req.user.id;
    await this.ragService.deleteUserContext(userId, contextId);
    return {
      success: true,
      message: 'Context deleted successfully',
    };
  }
}
