import { IsNotEmpty } from 'class-validator';

const FORBIDDEN_PROPERTY = Symbol('FORBIDDEN_PROPERTY');

/**
 * Guard class used to prevent class-transformer discriminator to fallback to default type
 */
export class ForbiddenDiscriminatorDto {
  @IsNotEmpty({ message: 'Forbidden discriminator' })
  public [FORBIDDEN_PROPERTY]: undefined;
}
