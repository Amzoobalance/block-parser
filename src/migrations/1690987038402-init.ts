import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690987038402 implements MigrationInterface {
  name = 'Init1690987038402';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("hash" character varying NOT NULL, "from" character varying NOT NULL, "value" character varying NOT NULL, "blockNumber" character varying, CONSTRAINT "PK_de4f0899c41c688529784bc443f" PRIMARY KEY ("hash"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "block" ("number" character varying NOT NULL, CONSTRAINT "PK_38414873c187a3e0c7943bc4c7b" PRIMARY KEY ("number"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b39efec8ac50249f9bd91bdbf3a" FOREIGN KEY ("blockNumber") REFERENCES "block"("number") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase(process.env.POSTGRES_DB);
  }
}
