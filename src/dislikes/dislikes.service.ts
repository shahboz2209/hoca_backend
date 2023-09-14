import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Dislikes } from './models/dislikes.model';
import { InjectModel } from '@nestjs/sequelize';
import { DislikesDto } from './dto/dislikes.dto';

@Injectable()
export class DislikesService {
  constructor(
    @InjectModel(Dislikes)
    private readonly dislikesRepository: typeof Dislikes,
  ) {}

  async create(dislikesDto: DislikesDto) {
    try {
      const data = await this.dislikesRepository.create({
        ...dislikesDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        dislike: 'Dislike created successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }

  async findAll() {
    try {
      const data = await this.dislikesRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const dislikes = await this.dislikesRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.dislikesRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: dislikes,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }

  async findById(id: string) {
    try {
      const data = await this.dislikesRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!data) {
        throw new BadRequestException('Not Found');
      }

      return {
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }

  async update(id: string, dislikesDto: DislikesDto) {
    try {
      const { data } = await this.findById(id);
      const updated_info = await this.dislikesRepository.update(dislikesDto, {
        where: { id: data.id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        dislike: 'Updated dislike',
        data: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await this.findById(id);
      data.destroy();
      return {
        dislike: 'Dislike deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.dislike);
    }
  }
}
