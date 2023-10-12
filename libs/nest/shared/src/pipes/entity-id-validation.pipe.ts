import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class EntityIdValidationPipe implements PipeTransform {
  public transform(value: unknown) {
    if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid entity id format');
    }

    return value;
  }
}
