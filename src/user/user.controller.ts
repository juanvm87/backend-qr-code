import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dtos/login.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { UserUpdate } from 'src/dtos/userUpdate.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
);

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
      const id = req.user._id;
      const user = await this.authService.getUser(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('google-signin')
  async googleAuth(@Body() token: any) {
    console.log(token);

    const ticket = await client.verifyIdToken({
      idToken: token.data,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const userInfo = ticket.getPayload();

    const reply = await this.authService.googleLogin({
      name: userInfo.name,
      phone: '',
      email: userInfo.email,
      password: '',
    });

    return reply;
  }
}
