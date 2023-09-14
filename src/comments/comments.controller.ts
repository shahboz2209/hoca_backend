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
import { CommentsService } from './comments.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { CommentsDto } from './dto/comments.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create new comments' })
  // @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() commentsDto: CommentsDto,
  ) {
    return this.commentsService.create(commentsDto);
  }

  @ApiOperation({ summary: 'Get all comments' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @ApiOperation({ summary: 'Pagination comments' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.commentsService.paginate(page);
  }

  @ApiOperation({ summary: 'Get comments by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @ApiOperation({ summary: 'Update comments by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() commentsDto: CommentsDto) {
    return this.commentsService.update(id, commentsDto);
  }

  @ApiOperation({ summary: 'Delete comments by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
