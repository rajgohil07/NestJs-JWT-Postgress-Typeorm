import { CommonEntity } from './common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity extends CommonEntity {
  @Column({
    comment: 'Name of the user',
  })
  Name: string;

  @Column({
    unique: true,
    comment: 'Email id of the user',
  })
  Email: string;

  @Column({
    type: 'text',
    comment: 'Password of user in a hash form',
  })
  Password: string;
}
