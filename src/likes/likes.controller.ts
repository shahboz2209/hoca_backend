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
import { LikesService } from './likes.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { LikesDto } from './dto/likes.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: 'Create new likes' })
  // @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() likesDto: LikesDto,
  ) {
    return this.likesService.create(likesDto);
  }

  @ApiOperation({ summary: 'Get all likes' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @ApiOperation({ summary: 'Pagination likes' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.likesService.paginate(page);
  }

  @ApiOperation({ summary: 'Get likes by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.likesService.findById(id);
  }

  @ApiOperation({ summary: 'Update likes by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() likesDto: LikesDto) {
    return this.likesService.update(id, likesDto);
  }

  @ApiOperation({ summary: 'Delete likes by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(id);
  }
}
