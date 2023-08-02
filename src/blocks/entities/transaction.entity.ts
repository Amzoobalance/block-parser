import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Block } from './block.entity';

@Entity()
export class Transaction {
  @PrimaryColumn()
  hash: string;

  @ManyToOne(() => Block, (block) => block.transactions)
  block: Block;

  @Column()
  from: string;

  @Column()
  value: string;
}
