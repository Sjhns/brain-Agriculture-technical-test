import { IsString, IsNotEmpty, IsIn, IsArray, ValidateNested, IsNumber, Min, IsUUID, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDocument } from '../../../common/domain/validators/is-document.decorator';
import { DocumentType, CropType } from '../../../common/domain/enums';

export class PlantedCropDto {
  @ApiProperty({ description: 'The harvest season name (e.g. "2021", "2021/2022")' })
  @IsString()
  @IsNotEmpty()
  season: string;

  @ApiProperty({ enum: CropType })
  @IsIn(Object.values(CropType))
  cropType: CropType;
}

export class FarmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Two letter state code or name' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  arableArea: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({ type: [PlantedCropDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantedCropDto)
  plantedCrops: PlantedCropDto[];
}

export class CreateProducerDto {
  @ApiProperty({ description: 'CPF or CNPJ without formatting (only numbers)' })
  @IsString()
  @IsNotEmpty()
  @IsDocument()
  document: string;

  @ApiProperty({ enum: DocumentType })
  @IsIn(Object.values(DocumentType))
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: [FarmDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FarmDto)
  farms?: FarmDto[];
}
