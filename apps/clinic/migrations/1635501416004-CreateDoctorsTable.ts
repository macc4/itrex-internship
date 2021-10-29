import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorsTable1635501416004 implements MigrationInterface {
  name = 'CreateDoctorsTable1635501416004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE clinic.doctor 
    (
      id SERIAL NOT NULL, 
      user_id character varying NOT NULL, 
      CONSTRAINT UQ_doctor_user_id UNIQUE (user_id), 
      CONSTRAINT PK_doctor_id PRIMARY KEY (id)
    );    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE clinic.doctor;
    `);
  }
}
