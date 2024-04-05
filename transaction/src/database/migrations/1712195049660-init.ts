import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1712195049660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "transaction" (
                "accountExternalId" uuid NOT NULL,
                type numeric NOT NULL,
                status numeric NOT NULL,
                "createDateTime" time with time zone NOT NULL,
                "lastChangedDateTime" time with time zone,
                value numeric NOT NULL,
                PRIMARY KEY ("accountExternalId")
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "transaction"`,
        );
    }
}
