import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Campaign } from '../../campaign/entities/campaign.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Campaign, (campaign) => campaign.category)
  campaigns?: Campaign[];
}
