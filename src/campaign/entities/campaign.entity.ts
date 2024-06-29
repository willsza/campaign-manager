import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CampaignStatus } from '../enums/status.enum';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @CreateDateColumn()
  dataCadastro: Date;

  @Column()
  dataInicio: Date;

  @Column()
  dataFim: Date;

  @Column()
  categoria: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ATIVA,
  })
  status: CampaignStatus;

  @Column({ default: false })
  isDeleted: boolean;
}
