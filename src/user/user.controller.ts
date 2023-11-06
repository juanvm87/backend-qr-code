import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dtos/login.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { UserUpdate } from 'src/dtos/userUpdate.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private authService: UserService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      return this.authService.signUp(signUpDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch()
  @UseGuards(AuthGuard())
  async userUpdate(@Body() userUpdate: UserUpdate, @Req() req) {
    try {
      const repy = await this.authService.updateUser(userUpdate, req.user._id);

      return repy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('id')
  @UseGuards(AuthGuard())
  async getUser(@Req() req) {
    try {
      const user = await this.authService.getUser(req.user._id);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
