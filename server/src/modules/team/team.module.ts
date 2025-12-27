import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventModule } from '../event/event.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { TeamController } from './team.controller';
import { TeamRepository } from './repositories/team.repository';
import { TeamMemberRepository } from './repositories/team-member.repository';
import { TeamRitualRepository } from './repositories/team-ritual.repository';
import { TeamAvailabilityRepository } from './repositories/team-availability.repository';
import { TeamService } from './services/team.service';
import { TeamMemberService } from './services/team-member.service';
import { TeamRitualService } from './services/team-ritual.service';
import { TeamAvailabilityService } from './services/team-availability.service';

@Module({
  imports: [DatabaseModule, EventModule, EmailModule, UsersModule],
  controllers: [TeamController],
  providers: [
    TeamRepository,
    TeamMemberRepository,
    TeamRitualRepository,
    TeamAvailabilityRepository,
    TeamService,
    TeamMemberService,
    TeamRitualService,
    TeamAvailabilityService,
  ],
  exports: [
    TeamService,
    TeamMemberService,
    TeamRitualService,
    TeamAvailabilityService,
  ],
})
export class TeamModule {}
