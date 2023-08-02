import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockModule } from './blocks/block.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './blocks/entities/transaction.entity';
import { ConfigModule } from '@nestjs/config';
import { Block } from './blocks/entities/block.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [Transaction, Block],
        autoLoadEntities: true,
        migrationsRun: false,
      }),
    }),
    BlockModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
