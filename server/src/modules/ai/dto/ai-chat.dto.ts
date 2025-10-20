import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AIMessage } from '../interfaces/ai.interface';

export class MessageDto {
  @ApiProperty({ enum: ['user', 'assistant', 'system', 'function'] })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'assistant' | 'system' | 'function';

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Function call data' })
  @IsOptional()
  @IsObject()
  function_call?: {
    name: string;
    arguments: Record<string, any>;
  };
}

export class ChatRequestDto {
  @ApiProperty({ description: 'User message', example: 'Schedule a team meeting on Monday at 10am' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Conversation ID for continuing chat' })
  @IsOptional()
  @IsString()
  conversation_id?: string;

  @ApiPropertyOptional({ description: 'Additional context' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Chat history', type: [MessageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  history?: MessageDto[];
}

export class ChatResponseDto {
  @ApiProperty({ description: 'AI response text' })
  response: string;

  @ApiProperty({ description: 'Conversation ID' })
  conversation_id: string;

  @ApiPropertyOptional({ description: 'Function calls to execute', type: [Object] })
  function_calls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;

  @ApiPropertyOptional({ description: 'Actions performed', type: [Object] })
  actions?: Array<{
    type: string;
    status: string;
    result?: any;
  }>;

  @ApiPropertyOptional({ description: 'Pending actions awaiting confirmation', type: [Object] })
  pending_actions?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    parameters: Record<string, any>;
    analysis?: any;
    requires_confirmation: boolean;
  }>;

  @ApiPropertyOptional({ description: 'Thinking process steps', type: [Object] })
  thinking_steps?: Array<{
    id: string;
    status: string;
    label: string;
    icon?: string;
  }>;

  @ApiProperty({ description: 'Timestamp' })
  timestamp: Date;
}


export class FunctionExecutionDto {
  @ApiProperty({ description: 'Function name' })
  @IsString()
  @IsNotEmpty()
  function_name: string;

  @ApiProperty({ description: 'Function parameters' })
  @IsObject()
  @IsNotEmpty()
  parameters: Record<string, any>;

  @ApiPropertyOptional({ description: 'Conversation ID' })
  @IsOptional()
  @IsString()
  conversation_id?: string;
}

export class ConfirmActionDto {
  @ApiProperty({ description: 'Pending action ID' })
  @IsString()
  @IsNotEmpty()
  action_id: string;

  @ApiProperty({ description: 'Confirmation decision' })
  @IsNotEmpty()
  confirmed: boolean;

  @ApiPropertyOptional({ description: 'Modified parameters' })
  @IsOptional()
  @IsObject()
  modified_parameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Conversation ID' })
  @IsOptional()
  @IsString()
  conversation_id?: string;
}
