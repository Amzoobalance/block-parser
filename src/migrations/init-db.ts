import { DataSource } from 'typeorm';
import 'dotenv/config';

const internalDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

internalDataSource.initialize().then(async (source) => {
  await source
    .createQueryRunner()
    .createDatabase(process.env.POSTGRES_DB, true);

  await source.destroy();
});
