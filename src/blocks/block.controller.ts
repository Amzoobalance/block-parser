import { Controller, Get } from '@nestjs/common';
import { BlockService } from './block.service';
import { Transaction } from './entities/transaction.entity';
import { hexToStr, strToHex } from '../utils/str-to-hex.util';
import { Block } from './entities/block.entity';
import { Cron } from '@nestjs/schedule';

const fetchEtherScan = (url: string) =>
  fetch(`https://api.etherscan.io${url}`)
    .then((res) => res.json())
    .then((body) => body.result);

const getBlock = (blockNumber: string) =>
  fetchEtherScan(
    `/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${process.env.API_KEY}`,
  );

const getLastAvailableBlockNumber = () =>
  fetchEtherScan(
    `/api?module=proxy&action=eth_blockNumber&apikey=${process.env.API_KEY}`,
  );

const getNextBlockNumber = (lastBlockFromDb: string) => {
  return hexToStr(strToHex(lastBlockFromDb) + 1);
};

const collectAddresses = (transactions: Transaction[]) => {
  const addresses = {};

  transactions.forEach((transaction) => {
    if (!addresses[transaction.from]) addresses[transaction.from] = 0x0;
    addresses[transaction.from] += strToHex(transaction.value);
  });

  return addresses;
};

const collectTransactions = (blocks: Block[]) =>
  blocks.reduce(
    (acc, block) => acc.concat(block.transactions),
    [] as Transaction[],
  );

const getAddressesByMaxValue = (addresses: Record<string, number>) =>
  Object.keys(addresses).sort((key1, key2) => {
    if (addresses[key1] < addresses[key2]) return 1;
    if (addresses[key1] > addresses[key2]) return -1;
    return 0;
  });

@Controller('api/max-value-address')
export class BlockController {
  private transactionsService: BlockService;

  constructor(transactionsService: BlockService) {
    this.transactionsService = transactionsService;
  }

  @Get()
  public async getMaxValueAddress() {
    const blocks = await this.transactionsService.getLast100Blocks();
    const transactions = collectTransactions(blocks);
    const addresses = collectAddresses(transactions);
    const addressesByMaxValue = getAddressesByMaxValue(addresses);

    return { result: addressesByMaxValue[0] ?? null };
  }

  @Cron('* * * * *')
  public async parseTransactions() {
    const lastBlockNumber = await this.transactionsService.getLastBlockNumber();
    const lastAvailableBlockNumber = await getLastAvailableBlockNumber();
    const nextBlockNumber = getNextBlockNumber(lastBlockNumber);

    if (strToHex(nextBlockNumber) <= strToHex(lastAvailableBlockNumber)) {
      console.debug('Saving block', nextBlockNumber);
      const block = await getBlock(nextBlockNumber);
      await this.transactionsService.createBlock(block);
    }
  }
}
