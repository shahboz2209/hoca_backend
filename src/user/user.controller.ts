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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { UserDto } from './dto/user.dto';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/file-validation.pipe';
import { RegisterUserDto } from './dto/register.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Create new user' })
  // @UseGuards(AuthGuard)
  @Post('register')
  create(@Body() addUserDto: RegisterUserDto) {
    return this.userService.create(addUserDto);
  }

  @ApiOperation({ summary: 'Log in user' })
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.login(loginUserDto, res);
  }

  @ApiOperation({ summary: 'Log out user' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all users' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Pagination users' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.userService.paginate(page);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // @ApiOperation({ summary: 'New password of the user' })
  // @UseGuards(AuthGuard)
  // @Patch('newPassword')
  // newPassword(@Param('id') id: string, newPasswordDto: NewPasswordDto) {
  //   return this.userService.newPassword(id, newPasswordDto);
  // }

  // @ApiOperation({ summary: 'Forgot password user' })
  // // @UseGuards(AuthGuard)
  // @Patch('forgotPassword')
  // forgotPassword(
  //   @Param('id') id: string,
  //   forgotPasswordDto: ForgotPasswordDto,
  // ) {
  //   return this.userService.forgotPassword(id, forgotPasswordDto);
  // }

  @ApiOperation({ summary: 'Update user by ID' })
  // @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        birth_date: {
          type: 'date',
        },
        isAlien: {
          type: 'boolean',
        },
        email: {
          type: 'string',
        },
        gender: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() userDto: UserDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.userService.update(id, userDto, image);
  }

  @ApiOperation({ summary: 'Delete User by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
