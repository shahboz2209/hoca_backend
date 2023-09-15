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
import { TravelsService } from './travels.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { TravelsDto } from './dto/travels.dto';
import { ImageValidationPipe } from 'src/pipes/file-validation.pipe';

@ApiTags('Travels')
@Controller('travels')
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) {}

  @ApiOperation({ summary: 'Create new travels' })
  // @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        departure_date: {
          type: 'string',
          format: 'date-time',
        },
        arrival_date: {
          type: 'string',
          format: 'date-time',
        },
        destinations: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        cost: {
          type: 'string',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() travelsDto: TravelsDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.travelsService.create(travelsDto, image);
  }

  @ApiOperation({ summary: 'Get all travels' })
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.travelsService.findAll();
  }

  @ApiOperation({ summary: 'Pagination travels' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.travelsService.paginate(page);
  }

  @ApiOperation({ summary: 'Get travels by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.travelsService.findById(id);
  }

  @ApiOperation({ summary: 'Update travels by ID' })
  // @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        departure_date: {
          type: 'string',
          format: 'date-time',
        },
        arrival_date: {
          type: 'string',
          format: 'date-time',
        },
        destinations: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        cost: {
          type: 'string',
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() travelsDto: TravelsDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.travelsService.update(id, travelsDto, image);
  }

  @ApiOperation({ summary: 'Delete travels by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelsService.remove(id);
  }
}
