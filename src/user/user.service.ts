import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

dotenv.config();
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // register the user into the database
  async registerUser(
    Name: string,
    Email: string,
    Password: string,
  ): Promise<UserEntity> {
    const lowerEmail = Email.toLowerCase();
    const hashPassword = await bcrypt.hash(Password, 10);
    const CreateUserObject = {
      Name,
      Email,
      Password: hashPassword,
    };
    const findEmailExist: UserEntity = await this.userRepository.findOne({
      where: { Email: lowerEmail },
    });
    // if email exist in the database throw error
    if (findEmailExist) {
      throw new BadRequestException(
        'This Email is already exist in the system',
      );
    }
    const createUser = this.userRepository.create(CreateUserObject);
    return this.userRepository.save(createUser);
  }

  // login into system
  async loginSystem(
    Email: string,
    Password: string,
  ): Promise<{ Token: string }> {
    const lowerEmail = Email.toLowerCase();
    const findData = await this.userRepository.findOne({
      where: { Email: lowerEmail },
    });
    if (!findData) {
      throw new NotFoundException('Provided email does not found!');
    }
    const validPassword = await bcrypt.compare(Password, findData.Password);
    if (validPassword) {
      // if provided password is true then generate token
      const objData = {
        ID: findData.ID,
        Name: findData.Name,
        Email: findData.Email,
      };
      const generatedToken = await JWT.sign(objData, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN,
      });
      return { Token: generatedToken };
    }
    throw new UnauthorizedException('Sorry, your password is invalid');
  }
}
