import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamNotFoundException extends HttpException {
  constructor(teamId?: string) {
    super(
      teamId ? `Team with ID ${teamId} not found` : 'Team not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class TeamMemberNotFoundException extends HttpException {
  constructor(memberId?: string) {
    super(
      memberId ? `Team member with ID ${memberId} not found` : 'Team member not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class TeamRitualNotFoundException extends HttpException {
  constructor(ritualId?: string) {
    super(
      ritualId ? `Team ritual with ID ${ritualId} not found` : 'Team ritual not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AlreadyTeamMemberException extends HttpException {
  constructor() {
    super('User is already a member of this team', HttpStatus.CONFLICT);
  }
}

export class MaxTeamMembersException extends HttpException {
  constructor(limit: number) {
    super(`Maximum number of team members (${limit}) reached`, HttpStatus.BAD_REQUEST);
  }
}

export class MaxTeamRitualsException extends HttpException {
  constructor(limit: number) {
    super(`Maximum number of team rituals (${limit}) reached`, HttpStatus.BAD_REQUEST);
  }
}

export class NotTeamOwnerException extends HttpException {
  constructor() {
    super('Only team owner can perform this action', HttpStatus.FORBIDDEN);
  }
}

export class NotTeamAdminException extends HttpException {
  constructor() {
    super('Only team admins can perform this action', HttpStatus.FORBIDDEN);
  }
}

export class CannotRemoveOwnerException extends HttpException {
  constructor() {
    super('Cannot remove team owner from team', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidRotationTypeException extends HttpException {
  constructor() {
    super('Invalid rotation type specified', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidTimezoneException extends HttpException {
  constructor(timezone: string) {
    super(`Invalid timezone: ${timezone}`, HttpStatus.BAD_REQUEST);
  }
}

export class CannotInviteOwnerException extends HttpException {
  constructor() {
    super('Cannot invite team owner as a member', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundForInviteException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} not found. Please check the email address.`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedInvitationActionException extends HttpException {
  constructor() {
    super('You are not authorized to accept/decline this invitation', HttpStatus.FORBIDDEN);
  }
}

export class InvitationNotPendingException extends HttpException {
  constructor(status: string) {
    super(`Invitation is not pending. Current status: ${status}`, HttpStatus.BAD_REQUEST);
  }
}
