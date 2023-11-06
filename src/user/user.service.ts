import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserUpdate } from 'src/dtos/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      let userId;
      const { name, phone, email, password } = signUpDto;
      let reply;
      do {
        userId = String(Math.floor(1 + Math.random() * 999998)).padStart(
          6,
          '0',
        );
        reply = await this.userModel.findOne({ userId }).exec();
      } while (reply);
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        userId,
        name,
        phone,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ _id: user._id });

      return { token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginDto;
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ _id: user._id });
      console.log('71 auth.services token', token);

      return { token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getUser(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(userUpdate: UserUpdate, id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (user.email !== userUpdate.email) {
        const emailExists = await this.userModel.findOne({
          email: userUpdate.email,
        });
        if (emailExists) {
          throw new ConflictException('Email is already in use');
        }
      }
      const updatedFields: any = {};
      if (userUpdate.email) {
        updatedFields.email = userUpdate.email;
      }
      if (userUpdate.name) {
        updatedFields.name = userUpdate.name;
      }
      if (userUpdate.password) {
        const isPasswordMatched = await bcrypt.compare(
          userUpdate.password,
          user.password,
        );

        if (!isPasswordMatched) {
          throw new UnauthorizedException('Old password is incorrect');
        }
      }
      if (userUpdate.newPassword) {
        const hashedPassword = await bcrypt.hash(userUpdate.newPassword, 10);
        updatedFields.password = hashedPassword;
      }
      if (userUpdate.phone) {
        updatedFields.phone = userUpdate.phone;
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updatedFields, {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validators
        })
        .exec();

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
