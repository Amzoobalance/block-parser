import { Block } from '../blocks/entities/block.entity';
import { Transaction } from '../blocks/entities/transaction.entity';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { Init1690987038402 } from './1690987038402-init';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Transaction, Block],
  migrations: [Init1690987038402],
});
