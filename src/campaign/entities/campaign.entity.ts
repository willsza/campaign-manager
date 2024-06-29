import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from '../../category/entities/category.entity';
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

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ATIVA,
  })
  status: CampaignStatus;

  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Category, (category) => category.campaigns, { eager: true })
  category: Category;
}
