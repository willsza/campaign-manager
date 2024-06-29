import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { CampaignStatus } from '../enums/status.enum';

export class CreateCampaignDto {
  @IsString()
  nome: string;

  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  dataFim: Date;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsInt()
  categoryId: number;
}
