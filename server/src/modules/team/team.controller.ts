import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './services/team.service';
import { TeamMemberService } from './services/team-member.service';
import { TeamRitualService } from './services/team-ritual.service';
import { TeamAvailabilityService } from './services/team-availability.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  InviteMemberDto,
  UpdateMemberRoleDto,
  CreateRitualDto,
  UpdateRitualDto,
  GetAvailabilityHeatmapDto,
  FindOptimalTimeDto,
} from './dto/team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import {
  ApiCreateTeam,
  ApiGetMyTeams,
  ApiGetMyPendingInvitations,
  ApiGetOwnedTeams,
  ApiGetTeamById,
  ApiUpdateTeam,
  ApiDeleteTeam,
  ApiInviteMember,
  ApiGetMembers,
  ApiAcceptInvitation,
  ApiDeclineInvitation,
  ApiUpdateMemberRole,
  ApiRemoveMember,
  ApiLeaveTeam,
  ApiCreateRitual,
  ApiGetRituals,
  ApiUpdateRitual,
  ApiDeleteRitual,
  ApiGetRotationHistory,
  ApiGetAvailabilityHeatmap,
  ApiFindOptimalTimes,
} from './team.swagger';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly memberService: TeamMemberService,
    private readonly ritualService: TeamRitualService,
    private readonly availabilityService: TeamAvailabilityService,
  ) { }

  @Post()
  @ApiCreateTeam()
  create(@CurrentUserId() userId: string, @Body() createTeamDto: CreateTeamDto) {
    return this.teamService.createTeam(userId, createTeamDto);
  }

  @Get()
  @ApiGetMyTeams()
  getMyTeams(@CurrentUserId() userId: string) {
    return this.teamService.getMyTeams(userId);
  }

  @Get('invitations/pending')
  @ApiGetMyPendingInvitations()
  getMyPendingInvitations(@CurrentUserId() userId: string) {
    return this.memberService.getMyPendingInvitations(userId);
  }

  @Get('owned')
  @ApiGetOwnedTeams()
  getOwnedTeams(@CurrentUserId() userId: string) {
    return this.teamService.getOwnedTeams(userId);
  }

  @Get(':id')
  @ApiGetTeamById()
  findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.teamService.getTeamById(id, userId);
  }

  @Patch(':id')
  @ApiUpdateTeam()
  update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(id, userId, updateTeamDto);
  }

  @Delete(':id')
  @ApiDeleteTeam()
  remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.teamService.deleteTeam(id, userId);
  }

  @Post(':id/members')
  @ApiInviteMember()
  async inviteMember(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.memberService.inviteMember(id, inviteMemberDto);
  }

  @Get(':id/members')
  @ApiGetMembers()
  async getMembers(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Query('status') status?: string,
  ) {
    await this.teamService.validateMemberAccess(id, userId);
    return this.memberService.getTeamMembers(id, status);
  }

  @Post('invitations/:token/accept')
  @ApiAcceptInvitation()
  acceptInvitation(
    @Param('token') token: string,
    @CurrentUserId() userId: string,
  ) {
    // Calling memberService with token as memberId
    return this.memberService.acceptInvitation(token, userId);
  }

  @Post('invitations/:token/decline')
  @ApiDeclineInvitation()
  declineInvitation(
    @Param('token') token: string,
    @CurrentUserId() userId: string,
  ) {
    return this.memberService.declineInvitation(token, userId);
  }

  @Patch(':id/members/:memberId/role')
  @ApiUpdateMemberRole()
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUserId() userId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.memberService.updateMemberRole(memberId, updateMemberRoleDto);
  }

  @Delete(':id/members/:memberId')
  @ApiRemoveMember()
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUserId() userId: string,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.memberService.removeMember(memberId);
  }

  @Post(':id/leave')
  @ApiLeaveTeam()
  leaveTeam(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.memberService.leaveTeam(id, userId);
  }

  @Post(':id/rituals')
  @ApiCreateRitual()
  async createRitual(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() createRitualDto: CreateRitualDto,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.ritualService.createRitual(id, createRitualDto);
  }

  @Get(':id/rituals')
  @ApiGetRituals()
  async getRituals(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.teamService.validateMemberAccess(id, userId);
    return this.ritualService.getTeamRituals(id);
  }

  @Patch(':id/rituals/:ritualId')
  @ApiUpdateRitual()
  async updateRitual(
    @Param('id') id: string,
    @Param('ritualId') ritualId: string,
    @CurrentUserId() userId: string,
    @Body() updateRitualDto: UpdateRitualDto,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.ritualService.updateRitual(ritualId, updateRitualDto);
  }

  @Delete(':id/rituals/:ritualId')
  @ApiDeleteRitual()
  async deleteRitual(
    @Param('id') id: string,
    @Param('ritualId') ritualId: string,
    @CurrentUserId() userId: string,
  ) {
    await this.teamService.validateAdminAccess(id, userId);
    return this.ritualService.deleteRitual(ritualId);
  }

  @Get(':id/rituals/:ritualId/rotation')
  @ApiGetRotationHistory()
  async getRotationHistory(
    @Param('id') id: string,
    @Param('ritualId') ritualId: string,
    @CurrentUserId() userId: string,
  ) {
    await this.teamService.validateMemberAccess(id, userId);
    return this.ritualService.getRotationHistory(ritualId);
  }

  @Get(':id/heatmap')
  @ApiGetAvailabilityHeatmap()
  async getAvailabilityHeatmap(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Query() query: GetAvailabilityHeatmapDto,
  ) {
    await this.teamService.validateMemberAccess(id, userId);
    return this.availabilityService.generateHeatmap(
      id,
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.timezone,
    );
  }

  @Get(':id/optimal-times')
  @ApiFindOptimalTimes()
  async findOptimalTimes(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Query() query: FindOptimalTimeDto,
  ) {
    await this.teamService.validateMemberAccess(id, userId);
    return this.availabilityService.findOptimalTimes(
      id,
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.duration_minutes,
      query.required_members,
      query.timezone,
    );
  }
}
