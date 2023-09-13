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
import { GroupService } from './groups.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { GroupDto } from './dto/groups.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Create a new group' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() groupDto: GroupDto) {
    return this.groupService.create(groupDto);
  }

  @ApiOperation({ summary: 'Get all groups' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @ApiOperation({ summary: 'Pagination groups' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.groupService.paginate(page);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  @UseGuards(AuthGuard)
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @ApiOperation({ summary: 'Update group by ID' })
  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() groupDto: GroupDto) {
    return this.groupService.update(id, groupDto);
  }

  @ApiOperation({ summary: 'Delete group by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
