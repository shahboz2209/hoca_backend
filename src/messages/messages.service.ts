import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Messages } from './models/messages.model';
import { InjectModel } from '@nestjs/sequelize';
import { MessagesDto } from './dto/messages.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Messages)
    private readonly messagesRepository: typeof Messages,
    private readonly fileService: FilesService,
  ) {}

  async create(messagesDto: MessagesDto, image: any) {
    try {
      console.log(image);
      if (image) {
        const file_name = await this.fileService.createFile(image);
        const data = await this.messagesRepository.create({
          ...messagesDto,
          image: file_name,
        });
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Message created successfully!',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.messagesRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const messages = await this.messagesRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.messagesRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: messages,
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
      const data = await this.messagesRepository.findOne({
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
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, messagesDto: MessagesDto, image: any) {
    try {
      const {data} = await this.findById(id);
      const file_name = await this.fileService.createFile(image);
      const updated_info = await this.messagesRepository.update(
        { ...messagesDto, image: file_name },
        {
          where: { id },
          returning: true,
        },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated message',
        data: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await this.findById(id);
      data.destroy();
      return {
        message: 'Message deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
