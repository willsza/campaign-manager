import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { CampaignStatus } from 'src/campaign/enums/status.enum';

export class CreateCampaignDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  nome: string;

  @IsNotEmpty({ message: 'DataInicio é obrigatória.' })
  @IsDateString()
  dataInicio: Date;

  @IsNotEmpty({ message: 'DataFim é obrigatória.' })
  @IsDateString()
  dataFim: Date;

  @IsEnum(CampaignStatus, {
    message: 'Status inválido. Deve ser ativa, pausada ou expirada.',
  })
  status: CampaignStatus;

  @IsNotEmpty({
    message: 'CategoryId é obrigatória.',
  })
  @IsInt({
    message: 'CategoryId deve ser um número inteiro.',
  })
  categoryId: number;
}
