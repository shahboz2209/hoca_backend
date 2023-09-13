import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answers.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { AnswerDto } from './dto/answers.dto';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ summary: 'Create a new answer' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() answerDto: AnswerDto) {
    return this.answerService.create(answerDto);
  }

  @ApiOperation({ summary: 'Get all answers' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @ApiOperation({ summary: 'Pagination answers' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.answerService.paginate(page);
  }

  @ApiOperation({ summary: 'Get answer by ID' })
  @UseGuards(AuthGuard)
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.answerService.findById(id);
  }

  @ApiOperation({ summary: 'Update answer by ID' })
  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() answerDto: AnswerDto) {
    return this.answerService.update(id, answerDto);
  }

  @ApiOperation({ summary: 'Delete answer by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(id);
  }
}
