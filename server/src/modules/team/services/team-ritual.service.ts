import { Injectable, Logger } from '@nestjs/common';
import { TeamRitualRepository } from '../repositories/team-ritual.repository';
import { TeamRepository } from '../repositories/team.repository';
import { TeamRitual } from '../interfaces/team.interface';
import { CreateRitualDto, UpdateRitualDto } from '../dto/team.dto';
import { TeamRitualNotFoundException, MaxTeamRitualsException } from '../exceptions/team.exceptions';
import { TEAM_CONSTANTS } from '../constants/team.constants';

@Injectable()
export class TeamRitualService {
  private readonly logger = new Logger(TeamRitualService.name);

  constructor(
    private readonly ritualRepo: TeamRitualRepository,
    private readonly teamRepo: TeamRepository,
  ) {}

  async createRitual(teamId: string, dto: CreateRitualDto): Promise<TeamRitual> {
    const ritualCount = await this.teamRepo.countRituals(teamId);
    if (ritualCount >= TEAM_CONSTANTS.LIMITS.MAX_RITUALS) {
      throw new MaxTeamRitualsException(TEAM_CONSTANTS.LIMITS.MAX_RITUALS);
    }

    return await this.ritualRepo.create(teamId, dto);
  }

  async getRitualById(ritualId: string): Promise<TeamRitual> {
    const ritual = await this.ritualRepo.findById(ritualId);
    if (!ritual) {
      throw new TeamRitualNotFoundException(ritualId);
    }
    return ritual;
  }

  async getTeamRituals(teamId: string, activeOnly: boolean = false): Promise<TeamRitual[]> {
    return await this.ritualRepo.findByTeam(teamId, activeOnly);
  }

  async updateRitual(ritualId: string, dto: UpdateRitualDto): Promise<TeamRitual> {
    await this.getRitualById(ritualId);
    return await this.ritualRepo.update(ritualId, dto);
  }

  async deleteRitual(ritualId: string): Promise<void> {
    await this.getRitualById(ritualId);
    await this.ritualRepo.delete(ritualId);
  }

  async getNextRotationUser(ritualId: string): Promise<string | null> {
    return await this.ritualRepo.getNextRotationUser(ritualId);
  }

  async recordRotation(ritualId: string, userId: string, scheduledAt: Date, eventId?: string): Promise<void> {
    await this.ritualRepo.createRotationRecord(ritualId, userId, scheduledAt, eventId);
    await this.ritualRepo.incrementRotation(ritualId);
  }

  async getRotationHistory(ritualId: string, limit: number = 10) {
    return await this.ritualRepo.getRotationHistory(ritualId, limit);
  }
}
