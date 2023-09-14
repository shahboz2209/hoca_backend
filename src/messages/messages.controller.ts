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
import { MessagesService } from './messages.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { MessagesDto } from './dto/messages.dto';
import { ImageValidationPipe } from 'src/pipes/file-validation.pipe';


@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Create new messages' })
  // @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        source: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() messagesDto: MessagesDto,
    @UploadedFile(new ImageValidationPipe()) source: Express.Multer.File,
  ) {
    return this.messagesService.create(messagesDto, source);
  }

  @ApiOperation({ summary: 'Get all messages' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @ApiOperation({ summary: 'Pagination messages' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.messagesService.paginate(page);
  }

  @ApiOperation({ summary: 'Get messages by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @ApiOperation({ summary: 'Update messages by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() messagesDto: MessagesDto) {
    return this.messagesService.update(id, messagesDto);
  }

  @ApiOperation({ summary: 'Delete messages by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
