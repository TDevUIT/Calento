import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiCreateTeam = () =>
    applyDecorators(
        ApiOperation({ summary: 'Create a new team' }),
        ApiResponse({
            status: 201,
            description: 'Team created successfully',
            schema: {
                example: SwaggerExamples.Team.Team.response,
            },
        }),
    );

export const ApiGetMyTeams = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get my teams' }),
        ApiResponse({
            status: 200,
            description: 'User teams retrieved successfully',
            schema: {
                example: SwaggerExamples.Team.List.response,
            },
        }),
    );

export const ApiGetMyPendingInvitations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get my pending team invitations',
            description:
                'Get all pending invitations for the current user where they can accept/decline',
        }),
        ApiResponse({
            status: 200,
            description: 'Pending invitations retrieved successfully',
        }),
    );

export const ApiGetOwnedTeams = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get teams I own' }),
        ApiResponse({
            status: 200,
            description: 'Owned teams retrieved successfully',
            schema: {
                example: SwaggerExamples.Team.List.response,
            },
        }),
    );

export const ApiGetTeamById = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get team by ID' }),
        ApiResponse({
            status: 200,
            description: 'Team retrieved successfully',
            schema: {
                example: SwaggerExamples.Team.Team.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Team not found' }),
    );

export const ApiUpdateTeam = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update team' }),
        ApiResponse({
            status: 200,
            description: 'Team updated successfully',
            schema: {
                example: SwaggerExamples.Team.Team.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Team not found' }),
    );

export const ApiDeleteTeam = () =>
    applyDecorators(
        ApiOperation({ summary: 'Delete team' }),
        ApiResponse({
            status: 200,
            description: 'Team deleted successfully',
        }),
        ApiResponse({ status: 404, description: 'Team not found' }),
    );

export const ApiInviteMember = () =>
    applyDecorators(
        ApiOperation({ summary: 'Invite team member' }),
        ApiResponse({
            status: 201,
            description: 'Member invited successfully',
        }),
    );

export const ApiGetMembers = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get team members' }),
        ApiResponse({
            status: 200,
            description: 'Team members retrieved successfully',
        }),
    );

export const ApiAcceptInvitation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Accept team invitation',
            description:
                'Accept a team invitation. Only the invited user can accept their own invitation.',
        }),
        ApiResponse({
            status: 200,
            description: 'Invitation accepted successfully',
        }),
        ApiResponse({
            status: 403,
            description: 'Not authorized to accept this invitation',
        }),
        ApiResponse({ status: 400, description: 'Invitation is not pending' }),
    );

export const ApiDeclineInvitation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Decline team invitation',
            description:
                'Decline a team invitation. Only the invited user can decline their own invitation.',
        }),
        ApiResponse({
            status: 200,
            description: 'Invitation declined successfully',
        }),
        ApiResponse({
            status: 403,
            description: 'Not authorized to decline this invitation',
        }),
        ApiResponse({ status: 400, description: 'Invitation is not pending' }),
    );

export const ApiUpdateMemberRole = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update member role' }),
        ApiResponse({
            status: 200,
            description: 'Member role updated successfully',
        }),
    );

export const ApiRemoveMember = () =>
    applyDecorators(
        ApiOperation({ summary: 'Remove team member' }),
        ApiResponse({
            status: 200,
            description: 'Member removed successfully',
        }),
    );

export const ApiLeaveTeam = () =>
    applyDecorators(
        ApiOperation({ summary: 'Leave team' }),
        ApiResponse({
            status: 200,
            description: 'Left team successfully',
        }),
    );

export const ApiCreateRitual = () =>
    applyDecorators(
        ApiOperation({ summary: 'Create team ritual' }),
        ApiResponse({
            status: 201,
            description: 'Ritual created successfully',
        }),
    );

export const ApiGetRituals = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get team rituals' }),
        ApiResponse({
            status: 200,
            description: 'Rituals retrieved successfully',
        }),
    );

export const ApiUpdateRitual = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update team ritual' }),
        ApiResponse({
            status: 200,
            description: 'Ritual updated successfully',
        }),
    );

export const ApiDeleteRitual = () =>
    applyDecorators(
        ApiOperation({ summary: 'Delete team ritual' }),
        ApiResponse({
            status: 200,
            description: 'Ritual deleted successfully',
        }),
    );

export const ApiGetRotationHistory = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get ritual rotation history' }),
        ApiResponse({
            status: 200,
            description: 'Rotation history retrieved successfully',
        }),
    );

export const ApiGetAvailabilityHeatmap = () =>
    applyDecorators(
        ApiOperation({ summary: 'Generate team availability heatmap' }),
        ApiResponse({
            status: 200,
            description: 'Heatmap generated successfully',
        }),
    );

export const ApiFindOptimalTimes = () =>
    applyDecorators(
        ApiOperation({ summary: 'Find optimal meeting times' }),
        ApiResponse({
            status: 200,
            description: 'Optimal times found successfully',
        }),
    );
