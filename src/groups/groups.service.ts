import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './models/groups.model';
import { GroupDto } from './dto/groups.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private readonly GroupRepository: typeof Group,
  ) {}

  async create(groupDto: GroupDto) {
    try {
      const group = await this.GroupRepository.create(groupDto);
      return {
        message: "Group qo'shildi",
        group,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const groups = await this.GroupRepository.findAll({
        include: { all: true },
      });
      return groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const groups = await this.GroupRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.GroupRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: groups,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const groups = await this.GroupRepository.findOne({
        where: { id },
        include: { all: true, nested: true },
      });
      if (!groups) {
        throw new BadRequestException('Group topilmadi!');
      }
      return groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, groupDto: GroupDto) {
    try {
      const group = await this.findById(id);
      const updated_info = await this.GroupRepository.update(groupDto, {
        where: { id: group.id },
        returning: true,
      });
      return {
        message: "Group o'zgartirildi",
        group: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const group = await this.findById(id);
      group.destroy();
      return { message: "Group o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
