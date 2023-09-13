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
import { TestService } from './tests.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { TestDto } from './dto/tests.dto';

@ApiTags('tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: 'Create a new test' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() testDto: TestDto) {
    return this.testService.create(testDto);
  }

  @ApiOperation({ summary: 'Get all tests' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @ApiOperation({ summary: 'Pagination tests' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.testService.paginate(page);
  }

  @ApiOperation({ summary: 'Get test by ID' })
  @UseGuards(AuthGuard)
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.testService.findById(id);
  }

  @ApiOperation({ summary: 'Update test by ID' })
  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() testDto: TestDto) {
    return this.testService.update(id, testDto);
  }

  @ApiOperation({ summary: 'Delete test by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(id);
  }
}
