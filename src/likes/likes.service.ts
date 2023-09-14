import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Likes } from './models/likes.model';
import { InjectModel } from '@nestjs/sequelize';
import { LikesDto } from './dto/likes.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Likes)
    private readonly likesRepository: typeof Likes,
  ) {}

  async create(likesDto: LikesDto) {
    try {
      const data = await this.likesRepository.create({
        ...likesDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        like: 'Like created successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.like);
    }
  }

  async findAll() {
    try {
      const data = await this.likesRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.like);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const likes = await this.likesRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.likesRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: likes,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.like);
    }
  }

  async findById(id: string) {
    try {
      const data = await this.likesRepository.findOne({
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
      throw new BadRequestException(error.like);
    }
  }

  async update(id: string, likesDto: LikesDto) {
    try {
      const { data } = await this.findById(id);
      const updated_info = await this.likesRepository.update(likesDto, {
        where: { id: data.id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        like: 'Updated like',
        data: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.like);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await this.findById(id);
      data.destroy();
      return {
        like: 'Like deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.like);
    }
  }
}
