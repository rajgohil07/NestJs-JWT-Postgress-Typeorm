import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // register the user into the database
  @Post('create')
  registerUser(
    @Body('Name') Name: string,
    @Body('Email') Email: string,
    @Body('Password') Password: string,
  ): Promise<UserEntity> {
    return this.userService.registerUser(Name, Email, Password);
  }

  // login into system
  @Post('login')
  loginSystem(
    @Body('Email') Email: string,
    @Body('Password') Password: string,
  ): Promise<{ Token: string }> {
    return this.userService.loginSystem(Email, Password);
  }

  // get user listing
  @Get('allUser')
  getAllUserListing(
    @Req() req: Request & { user: { ID: number; Name: string; Email: string } },
  ) {
    return this.userService.getAllUserListing(req);
  }
}
