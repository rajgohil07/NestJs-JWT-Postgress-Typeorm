import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;
}
