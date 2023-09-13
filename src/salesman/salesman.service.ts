import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Salesman } from './models/salesman.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginSalesmanDto } from './dto/login-salesman.dto';
import { compare, hash } from 'bcryptjs';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Response } from 'express';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { SalesmanDto } from './dto/salesman.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';
import { generate } from 'otp-generator';
import { sendOTP } from 'src/utils/sendOtp';
import { Otp } from 'src/admin/models/otp.model';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';

@Injectable()
export class SalesmanService {
  constructor(
    @InjectModel(Salesman)
    private readonly salesmanRepository: typeof Salesman,
    @InjectModel(Otp) private readonly otpRepository: typeof Otp,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phoneDto: PhoneDto) {
    try {
      const code = generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendOTP(phoneDto.phone, code);
      const expire_time = Date.now() + 120000;
      const exist = await this.otpRepository.findOne({
        where: { phone: phoneDto.phone },
      });
      if (exist) {
        const otp = await this.otpRepository.update(
          { code, expire_time },
          { where: { phone: phoneDto.phone }, returning: true },
        );
        return {
          message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
          code,
          otp,
        };
      }
      const otp = await this.otpRepository.create({
        code,
        phone: phoneDto.phone,
        expire_time,
      });
      return {
        message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
        code,
        otp,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const check_phone = await this.otpRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (!check_phone) {
        throw new BadRequestException('Telefon raqamda xatolik!');
      }
      const now = Date.now();
      if (now > check_phone.expire_time) {
        check_phone.destroy();
        throw new BadRequestException(
          'Yuborilgan parol vaqti tugadi, iltimos telefon raqamni qaytadan kiritib, yangi parol oling!',
        );
      }
      if (verifyOtpDto.code != check_phone.code) {
        throw new BadRequestException('Tasdiqlash paroli xato!');
      }
      check_phone.destroy();
      return { message: 'Parol tasdiqlandi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(addSalesmanDto: LoginSalesmanDto) {
    try {
      const { phone, password } = addSalesmanDto;
      const exist_phone = await this.salesmanRepository.findOne({
        where: { phone },
      });
      if (exist_phone) {
        throw new BadRequestException('Bunday telefon raqam band!');
      }
      const hashed_password = await hash(password, 7);
      const salesman = await this.salesmanRepository.create({
        phone,
        hashed_password,
      });
      return { messagee: "Sotuvchi ro'yxatga kiritildi", salesman };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginSalesmanDto: LoginSalesmanDto, res: Response) {
    try {
      const { phone, password } = loginSalesmanDto;
      const salesman = await this.salesmanRepository.findOne({
        where: { phone },
      });
      if (!salesman) {
        throw new UnauthorizedException('Telefon raqam mos kelmadi!');
      }
      const is_match_password = await compare(
        password,
        salesman.hashed_password,
      );
      if (!is_match_password) {
        throw new UnauthorizedException('Parol mos kelmadi!');
      }
      const jwt_payload = { id: salesman.id };
      const { access_token, refresh_token } = await generateToken(
        jwt_payload,
        this.jwtService,
      );
      const hashed_refresh_token = await hash(refresh_token, 7);
      await this.salesmanRepository.update(
        { hashed_refresh_token },
        { where: { id: salesman.id }, returning: true },
      );
      await writeToCookie(refresh_token, res);
      return {
        mesage: 'Tizimga muvaffaqiyatli kirildi',
        access_token,
        salesman,
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
        throw new UnauthorizedException('Tizimdan chiqishda xatolik!');
      }
      const check = await this.findById(data.id);
      const is_match = await compare(refresh_token, check.hashed_refresh_token);
      if (!is_match) {
        throw new BadRequestException('Tizimdan chiqishda xatololik!');
      }
      const salesman = await this.salesmanRepository.update(
        { hashed_refresh_token: null },
        { where: { id: data.id }, returning: true },
      );
      res.clearCookie('refresh_token');
      return { mesage: 'Tizimdan chiqildi', salesman: salesman[1][0] };
    } catch (error) {}
  }

  async findAll() {
    try {
      const salesmans = await this.salesmanRepository.findAll({
        include: { all: true },
      });
      return salesmans;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const salesmans = await this.salesmanRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.salesmanRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: salesmans,
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
      const salesman = await this.salesmanRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!salesman) {
        throw new BadRequestException('Sotuvchi topilmadi!');
      }
      return salesman;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(id: string, newPasswordDto: NewPasswordDto) {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordDto;
      const salesman = await this.findById(id);
      const is_match_pass = await compare(
        old_password,
        salesman.hashed_password,
      );
      if (!is_match_pass) {
        throw new UnauthorizedException('Eski parol mos kelmadi!');
      }
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        salesman: updated_info[1][0],
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
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        salesman: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, salesmanDto: SalesmanDto) {
    try {
      const { phone, email } = salesmanDto;
      const salesman = await this.findById(id);
      if (phone) {
        const exist_phone = await this.salesmanRepository.findOne({
          where: { phone },
        });
        if (exist_phone) {
          if (exist_phone.id != salesman.id) {
            throw new BadRequestException('Bunday telefon raqam band!');
          }
        }
      }
      if (email) {
        const exist_email = await this.salesmanRepository.findOne({
          where: { email },
        });
        if (exist_email) {
          if (exist_email.id != salesman.id) {
            throw new BadRequestException('Bunday email band!');
          }
        }
      }
      const updated_info = await this.salesmanRepository.update(salesmanDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Ma'lumotlar tahrirlandi",
        salesman: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const salesman = await this.findById(id);
      salesman.destroy();
      return { message: "Sotuvchi ro'yxatdan o'chirildi", salesman };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
