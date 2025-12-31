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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import {
  RespondToInvitationDto,
  InvitationResponseDto,
} from '../dto/invitation.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiRespondAuthenticated, ApiRespondGuest } from './invitation.swagger';

@ApiTags('Event Invitations')
@Controller('events/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) { }

  @Post(':eventId/respond')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiRespondAuthenticated()
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
  @ApiRespondGuest()
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
