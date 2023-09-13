/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginStudentDto } from './dto/login-student.dto';
// import { PhoneDto } from 'src/admin/dto/phone.dto';
// import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { StudentDto } from './dto/student.dto';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateStudentDto } from './dto/update.dto';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Create a new student' })
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() addStudentDto: LoginStudentDto) {
    return this.studentService.create(addStudentDto);
  }

  @ApiOperation({ summary: 'Log in student' })
  @Post('login')
  login(
    @Body() loginStudentDto: LoginStudentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.login(loginStudentDto, res);
  }

  @ApiOperation({ summary: 'Log out student' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all students' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @ApiOperation({ summary: 'Pagination students' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.studentService.paginate(page);
  }

  @ApiOperation({ summary: 'Get student by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @ApiOperation({ summary: 'New password of the student' })
  @UseGuards(AuthGuard)
  @Patch('newPassword')
  newPassword(@Param('id') id: string, newPasswordDto: NewPasswordDto) {
    return this.studentService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Forgot password student' })
  // @UseGuards(AuthGuard)
  @Patch('forgotPassword')
  forgotPassword(
    @Param('id') id: string,
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.studentService.forgotPassword(id, forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Update student by ID for admin' })
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  updateInfo(
    @Param('id') id: string,
    @Body() loginStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateInfo(id, loginStudentDto);
  }

  @ApiOperation({ summary: 'Update student by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() studentDto: StudentDto) {
    return this.studentService.update(id, studentDto);
  }

  @ApiOperation({ summary: 'Delete Student by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
