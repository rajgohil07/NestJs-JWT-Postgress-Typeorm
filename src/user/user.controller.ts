import { Body, Controller, Post } from '@nestjs/common';
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
  ) {
    return this.userService.registerUser(Name, Email, Password);
  }

  // login into system
  @Post('login')
  loginSystem(
    @Body('Email') Email: string,
    @Body('Password') Password: string,
  ) {
    return this.userService.loginSystem(Email, Password);
  }
}
