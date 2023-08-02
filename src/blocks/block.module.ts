import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Block } from './entities/block.entity';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [TypeOrmModule.forFeature([Transaction, Block])],
  exports: [BlockService, TypeOrmModule],
})
export class BlockModule {}
