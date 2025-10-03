import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MessageService } from '../message/message.service';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  constructor(private readonly messageService: MessageService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    });

    if (errors.length > 0) {
      const errorMessages = this.formatErrors(errors);
      throw new BadRequestException({
        message: this.messageService.get('error.validation_failed'),
        errors: errorMessages,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): string[] {
    const errorMessages: string[] = [];

    errors.forEach(error => {
      if (error.constraints) {
        Object.values(error.constraints).forEach(constraint => {
          errorMessages.push(constraint as string);
        });
      }

      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatErrors(error.children);
        errorMessages.push(...nestedErrors);
      }
    });

    return errorMessages;
  }
}
