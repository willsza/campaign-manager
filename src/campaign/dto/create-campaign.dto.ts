import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty({
    message: 'CategoryId é obrigatória.',
  })
  @IsInt({
    message: 'CategoryId deve ser um número inteiro.',
  })
  categoryId: number;
}
