/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Student } from './models/student.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginStudentDto } from './dto/login-student.dto';
import { compare, hash } from 'bcryptjs';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Response } from 'express';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { StudentDto } from './dto/student.dto';
// import { PhoneDto } from 'src/admin/dto/phone.dto';
// import { generate } from 'otp-generator';
// import { sendOTP } from 'src/utils/sendOtp';
import { Otp } from 'src/admin/models/otp.model';
import { UpdateStudentDto } from './dto/update.dto';
// import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student)
    private readonly studentRepository: typeof Student,
    @InjectModel(Otp) private readonly otpRepository: typeof Otp,
    private readonly jwtService: JwtService,
  ) {}

  async create(addStudentDto: LoginStudentDto) {
    try {
      const { username, password, student_id, start_date, group_id } = addStudentDto;
      const exist_username = await this.studentRepository.findOne({
        where: { username },
      });
      if (exist_username) {
        throw new BadRequestException('Bunday username mavjud!');
      }
      const exist_id = await this.studentRepository.findOne({
        where: { student_id },
      });
      if (exist_id) {
        throw new BadRequestException('Bunday id mavjud!');
      }
      if (exist_id) {
        throw new BadRequestException('Bunday id mavjud!');
      }
      const hashed_password = await hash(password, 7);
      const student = await this.studentRepository.create({
        username,
        hashed_password,
        student_id,
        start_date,
        group_id,
      });
      return { message: "O'quvchi ro'yxatga kiritildi", student };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginStudentDto: LoginStudentDto, res: Response) {
    try {
      const { username, password } = loginStudentDto;
      const student = await this.studentRepository.findOne({
        where: { username },
      });
      if (!student) {
        throw new UnauthorizedException('Username topilmadi!');
      }
      const is_match_password = await compare(
        password,
        student.hashed_password,
      );
      if (!is_match_password) {
        throw new UnauthorizedException('Parol mos kelmadi!');
      }
      const jwt_payload = { id: student.id };
      const { access_token, refresh_token } = await generateToken(
        jwt_payload,
        this.jwtService,
      );
      const hashed_refresh_token = await hash(refresh_token, 7);
      await this.studentRepository.update(
        { hashed_refresh_token },
        { where: { id: student.id }, returning: true },
      );
      await writeToCookie(refresh_token, res);
      return {
        mesage: 'Tizimga muvaffaqiyatli kirildi',
        access_token,
        student,
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
      const student = await this.studentRepository.update(
        { hashed_refresh_token: null },
        { where: { id: data.id }, returning: true },
      );
      res.clearCookie('refresh_token');
      return { mesage: 'Tizimdan chiqildi', student: student[1][0] };
    } catch (error) {}
  }

  async findAll() {
    try {
      const students = await this.studentRepository.findAll({
        include: { all: true },
      });
      return students;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const students = await this.studentRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.studentRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: students,
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
      const student = await this.studentRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!student) {
        throw new BadRequestException('Sotuvchi topilmadi!');
      }
      return student;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(id: string, newPasswordDto: NewPasswordDto) {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordDto;
      const student = await this.findById(id);
      const is_match_pass = await compare(
        old_password,
        student.hashed_password,
      );
      if (!is_match_pass) {
        throw new UnauthorizedException('Eski parol mos kelmadi!');
      }
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.studentRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        student: updated_info[1][0],
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
      const updated_info = await this.studentRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        student: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateInfo(id: string, loginStudentDto: UpdateStudentDto) {
    try {
      let { username, password, start_date, student_id } = loginStudentDto;
      const student = await this.findById(id);
      const pass = student.hashed_password;
      if (username) {
        const exist_username = await this.studentRepository.findOne({
          where: { username },
        });
        if (exist_username) {
          if (exist_username.id != student.id) {
            throw new BadRequestException('Bunday username raqam mavjud!');
          }
        }
      }
      if (student_id) {
        const exist_student_id = await this.studentRepository.findOne({
          where: { student_id },
        });
        if (exist_student_id) {
          if (exist_student_id.id != student.id) {
            throw new BadRequestException('Bunday student id raqam mavjud!');
          }
        }
      }
      let hashed_password: string;
      if (!password) {
        password = pass;
      } else {
        hashed_password = await hash(password, 7);
      }

      const updated_info = await this.studentRepository.update(
        {
          username,
          hashed_password,
          student_id,
          start_date,
        },
        {
          where: { id },
          returning: true,
        },
      );
      return {
        message: "Ma'lumotlar o'zgartirildi",
        student: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, studentDto: StudentDto) {
    try {
      const { phone, email } = studentDto;
      const student = await this.findById(id);
      if (phone) {
        const exist_phone = await this.studentRepository.findOne({
          where: { phone },
        });
        if (exist_phone) {
          if (exist_phone.id != student.id) {
            throw new BadRequestException('Bunday telefon raqam mavjud!');
          }
        }
      }
      if (email) {
        const exist_email = await this.studentRepository.findOne({
          where: { email },
        });
        if (exist_email) {
          if (exist_email.id != student.id) {
            throw new BadRequestException('Bunday email band!');
          }
        }
      }
      const updated_info = await this.studentRepository.update(studentDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Ma'lumotlar o'zgartirildi",
        student: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const student = await this.findById(id);
      student.destroy();
      return { message: "O'quvchi ro'yxatdan o'chirildi", student };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
