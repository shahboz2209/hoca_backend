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
        departure_date  : {
          type: 'date',
        },
        arrival_date: {
          type: 'string',
        },
        destinations: {
          type: 'string',
        },
        source: {
          type: 'string',
          format: 'binary',
        },
        cost: {
          type: 'number',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() travelsDto: TravelsDto,
    @UploadedFile(new ImageValidationPipe()) source: Express.Multer.File,
  ) {
    return this.travelsService.create(travelsDto, source);
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
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() travelsDto: TravelsDto) {
    return this.travelsService.update(id, travelsDto);
  }

  @ApiOperation({ summary: 'Delete travels by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelsService.remove(id);
  }
}
