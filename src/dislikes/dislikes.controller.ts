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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DislikesService } from './dislikes.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { DislikesDto } from './dto/dislikes.dto';

@ApiTags('Dislikes')
@Controller('dislikes')
export class DislikesController {
  constructor(private readonly dislikesService: DislikesService) {}

  @ApiOperation({ summary: 'Create new dislikes' })
  // @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() dislikesDto: DislikesDto,
  ) {
    return this.dislikesService.create(dislikesDto);
  }

  @ApiOperation({ summary: 'Get all dislikes' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.dislikesService.findAll();
  }

  @ApiOperation({ summary: 'Pagination dislikes' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.dislikesService.paginate(page);
  }

  @ApiOperation({ summary: 'Get dislikes by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dislikesService.findById(id);
  }

  @ApiOperation({ summary: 'Update dislikes by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dislikesDto: DislikesDto) {
    return this.dislikesService.update(id, dislikesDto);
  }

  @ApiOperation({ summary: 'Delete dislikes by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dislikesService.remove(id);
  }
}
