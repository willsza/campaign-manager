import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Campaign } from 'src/campaign/entities/campaign.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Campaign, (campaign) => campaign.category)
  campaigns: Campaign[];

  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;
}
