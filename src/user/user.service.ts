import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Response } from 'express';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { UserDto } from './dto/user.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';
import { generate } from 'otp-generator';
import { sendOTP } from 'src/utils/sendOtp';
import { Otp } from 'src/admin/models/otp.model';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';
import { FilesService } from '../files/files.service';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Otp) private readonly otpRepository: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) {}
  async create(addUserDto: RegisterUserDto) {
    try {
      const { email, username, password } = addUserDto;
      const exist_email = await this.userRepository.findOne({
        where: { email },
      });
      if (exist_email) {
        throw new BadRequestException('This email is already registered!');
      }
      const hashed_password = await hash(password, 7);
      const user = await this.userRepository.create({
        email,
        username,
        hashed_password,
      });
      return { messagee: 'Successfully registered', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new UnauthorizedException('Email not found!');
      }
      const is_match_password = await compare(password, user.hashed_password);
      if (!is_match_password) {
        throw new UnauthorizedException('The password did not match!');
      }
      const jwt_payload = { id: user.id };
      const { access_token, refresh_token } = await generateToken(
        jwt_payload,
        this.jwtService,
      );
      const hashed_refresh_token = await hash(refresh_token, 7);
      await this.userRepository.update(
        { hashed_refresh_token },
        { where: { id: user.id }, returning: true },
      );
      await writeToCookie(refresh_token, res);
      return {
        mesage: 'Logged successfully',
        access_token,
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response) {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      if (!data) {
        throw new UnauthorizedException('Error logging out!');
      }
      const check = await this.findById(data.id);
      const is_match = await compare(refresh_token, check.hashed_refresh_token);
      if (!is_match) {
        throw new BadRequestException('Error logging out!');
      }
      const user = await this.userRepository.update(
        { hashed_refresh_token: null },
        { where: { id: data.id }, returning: true },
      );
      res.clearCookie('refresh_token');
      return { mesage: 'Logged out', user: user[1][0] };
    } catch (error) {}
  }

  async findAll() {
    try {
      const users = await this.userRepository.findAll({
        include: { all: true },
      });
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const users = await this.userRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.userRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: users,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!user) {
        throw new BadRequestException('User not foud!');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(id: string, newPasswordDto: NewPasswordDto) {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordDto;
      const user = await this.findById(id);
      const is_match_pass = await compare(old_password, user.hashed_password);
      if (!is_match_pass) {
        throw new UnauthorizedException('Eski parol mos kelmadi!');
      }
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.userRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        user: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPassword(id: string, forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.findById(id);
      const { new_password, confirm_new_password } = forgotPasswordDto;
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.userRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        user: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, userDto: UserDto, image: any) {
    try {
      const { email } = userDto;
      const user = await this.findById(id);
      if (email) {
        const exist_email = await this.userRepository.findOne({
          where: { email },
        });
        if (exist_email) {
          if (exist_email.id != user.id) {
            throw new BadRequestException('This email is not available!');
          }
        }
      }
      if (image) {
        const file_name = await this.fileService.createFile(image);
        const updated_info = await this.userRepository.update(
          { ...userDto, image: file_name },
          {
            where: { id },
            returning: true,
          },
        );
        return {
          message: 'Editted user info',
          salesman: updated_info[1][0],
        };
      }
      const updated_info = await this.userRepository.update(userDto, {
        where: { id },
        returning: true,
      });
      return {
        message: 'Editted user info',
        user: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findById(id);
      user.destroy();
      return { message: "Deleted successfully", user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
