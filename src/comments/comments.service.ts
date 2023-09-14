import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Comments } from './models/comments.model';
import { InjectModel } from '@nestjs/sequelize';
import { CommentsDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments)
    private readonly commentsRepository: typeof Comments,
  ) {}

  async create(commentsDto: CommentsDto) {
    try {
      const data = await this.commentsRepository.create({
        ...commentsDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        comment: 'Comment created successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.comment);
    }
  }

  async findAll() {
    try {
      const data = await this.commentsRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.comment);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const comments = await this.commentsRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.commentsRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: comments,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.comment);
    }
  }

  async findById(id: string) {
    try {
      const data = await this.commentsRepository.findOne({
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
      throw new BadRequestException(error.comment);
    }
  }

  async update(id: string, commentsDto: CommentsDto) {
    try {
      const { data } = await this.findById(id);
      const updated_info = await this.commentsRepository.update(commentsDto, {
        where: { id: data.id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        comment: 'Updated comment',
        data: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.comment);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await this.findById(id);
      data.destroy();
      return {
        comment: 'Comment deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.comment);
    }
  }
}
