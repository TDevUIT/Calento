import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvitationResponseDto } from '../dto/invitation.dto';
import { SwaggerExamples } from '../../../common/swagger/swagger-examples';

export const ApiRespondAuthenticated = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Respond to event invitation (Authenticated)',
            description:
                'Accept, decline, or tentatively respond to event invitation. Event is automatically added to calendar when accepted.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Response recorded successfully',
            type: InvitationResponseDto,
            schema: {
                example: SwaggerExamples.Invitation.Response.response,
            },
        }),
    );

export const ApiRespondGuest = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Respond to event invitation (Guest)',
            description:
                'Accept, decline, or tentatively respond to event invitation as a guest. Receives .ics file when accepted.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Response recorded successfully',
            type: InvitationResponseDto,
            schema: {
                example: SwaggerExamples.Invitation.Response.response,
            },
        }),
    );
