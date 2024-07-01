import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import { CampaignStatus } from '../enums/status.enum';
import { CreateCampaignDto } from './create-campaign.dto';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @IsOptional()
  @IsEnum(CampaignStatus, {
    message: 'Status inválido. Deve ser ativa, pausada ou expirada.',
  })
  status?: CampaignStatus;
}
