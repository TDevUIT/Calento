import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { ContactResponseDto } from './dto/contact.dto';

export const ApiCreateContact = () =>
    applyDecorators(
        ApiOperation({ summary: 'Submit contact form' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Contact form submitted successfully',
            schema: {
                example: SwaggerExamples.Contact.Create.response,
            },
        }),
    );

export const ApiGetAllContacts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all contacts' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Contacts retrieved successfully',
            type: [ContactResponseDto],
            schema: {
                example: SwaggerExamples.Contact.List.response,
            },
        }),
    );

export const ApiGetContactById = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get contact by ID' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Contact retrieved successfully',
            type: ContactResponseDto,
            schema: {
                example: SwaggerExamples.Contact.Create.response,
            },
        }),
    );
