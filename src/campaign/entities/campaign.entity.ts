import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CampaignStatus } from 'src/campaign/enums/status.enum';
import { Category } from 'src/category/entities/category.entity';

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

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Category, (category) => category.campaigns, { eager: true })
  category: Category;
}
