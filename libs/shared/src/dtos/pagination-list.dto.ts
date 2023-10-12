import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PaginationListDto {
  @IsArray()
  public items: unknown[];

  @ApiProperty()
  @IsNumber()
  public totalItems: number;

  @ApiProperty()
  @IsBoolean()
  public hasPrevPage: boolean;

  @ApiProperty()
  @IsBoolean()
  public hasNextPage: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public page?: number | undefined;

  @ApiProperty()
  @IsNumber()
  public totalPages: number;
}
