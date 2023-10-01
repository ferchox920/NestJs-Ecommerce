import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLOrdersOpShippingFix21696131919995 implements MigrationInterface {
    name = 'AddTBLOrdersOpShippingFix21696131919995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "shippedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" ADD "shippedAt" TIMESTAMP NOT NULL`);
    }

}
