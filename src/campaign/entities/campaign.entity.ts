import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ default: 'ativa' })
  status: string;

  @Column({ default: false })
  isDeleted: boolean;
}
