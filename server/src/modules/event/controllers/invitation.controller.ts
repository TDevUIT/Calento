import {
  Controller,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import {
  RespondToInvitationDto,
  InvitationResponseDto,
} from '../dto/invitation.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Event Invitations')
@Controller('events/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post(':eventId/respond')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Respond to event invitation (Authenticated)',
    description: 'Accept, decline, or tentatively respond to event invitation. Event is automatically added to calendar when accepted.',
  })
  @ApiResponse({
    status: 200,
    description: 'Response recorded successfully',
    type: InvitationResponseDto,
  })
  async respondAuthenticated(
    @Param('eventId') eventId: string,
    @Query('token') token: string,
    @Body() dto: RespondToInvitationDto,
    @Request() req: any,
  ): Promise<InvitationResponseDto> {
    const userId = req.user?.id;
    
    return this.invitationService.respondToInvitation(
      eventId,
      token,
      dto,
      userId,
    );
  }

  @Post(':eventId/respond/guest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Respond to event invitation (Guest)',
    description: 'Accept, decline, or tentatively respond to event invitation as a guest. Receives .ics file when accepted.',
  })
  @ApiResponse({
    status: 200,
    description: 'Response recorded successfully',
    type: InvitationResponseDto,
  })
  async respondGuest(
    @Param('eventId') eventId: string,
    @Query('token') token: string,
    @Body() dto: RespondToInvitationDto,
  ): Promise<InvitationResponseDto> {
    return this.invitationService.respondToInvitation(
      eventId,
      token,
      dto,
      undefined, // No userId for guest
    );
  }
}
