import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Block {
  @PrimaryColumn()
  number: string;

  @OneToMany(() => Transaction, (transaction) => transaction.block, {
    cascade: true,
  })
  transactions: Transaction[];
}
