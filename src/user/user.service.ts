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
import { Not, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { constants } from 'src/helpers/constant';

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
      throw new BadRequestException(constants.EMAIL_ALREADY_EXIST);
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
      throw new NotFoundException(constants.EMAIL_NOT_FOUND);
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
      return { Token: `Bearer ${generatedToken}` };
    }
    throw new UnauthorizedException(constants.INVALID_PASSWORD);
  }

  // get user listing
  async getAllUserListing(
    req: Request & { user: { ID: number; Name: string; Email: string } },
  ) {
    const { user } = req;
    const findData = await this.userRepository.find({
      where: {
        ID: Not(user.ID),
      },
      select: ['ID', 'Name', 'Email'],
    });
    return {
      currentUser: user,
      AllUserListing: findData,
    };
  }
}
