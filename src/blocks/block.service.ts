import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Repository } from 'typeorm';
import { hexToStr, strToHex } from 'src/utils/str-to-hex.util';
import { INITIAL_BLOCK } from 'src/constants';

@Injectable()
export class BlockService {
  @InjectRepository(Block)
  private blocksRepository: Repository<Block>;

  public async getLastBlockNumber(): Promise<string> {
    const lastItem = await this.blocksRepository
      .createQueryBuilder()
      .select('block.number')
      .addOrderBy('block.number', 'DESC')
      .from(Block, 'block')
      .limit(1)
      .execute();

    return lastItem[0] && lastItem[0].block_number
      ? lastItem[0].block_number
      : hexToStr(strToHex(INITIAL_BLOCK) - 1);
  }

  public async createBlock(block: Block): Promise<Block> {
    return this.blocksRepository.save(block);
  }

  public async getLast100Blocks(): Promise<Block[]> {
    return this.blocksRepository.find({
      order: { number: 'DESC' },
      relations: { transactions: true },
      take: 100,
    });
  }
}
