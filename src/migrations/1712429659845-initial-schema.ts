import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1712429659845 implements MigrationInterface {
  name = 'InitialSchema1712429659845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "client_id" integer NOT NULL, "amount" numeric NOT NULL, "currency" character varying NOT NULL DEFAULT 'EUR', "original_amount" numeric NOT NULL, "original_currency" character varying NOT NULL, "date" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "client" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "client_id" integer NOT NULL, "discount_rate" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "client"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
