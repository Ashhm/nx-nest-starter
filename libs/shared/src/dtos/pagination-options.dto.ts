import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class SortOptionsDto {
  @ApiPropertyOptional({ name: 'sort[createdAt]', type: Number, default: -1 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  public createdAt = -1;
}

export class PaginationOptionsDto {
  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    const limit = parseInt(value, 10);
    return limit > 50 ? 50 : limit;
  })
  public limit?: number = 10;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  public page?: number = 1;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public select?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => SortOptionsDto)
  @ValidateNested()
  public sort?: SortOptionsDto;
}
