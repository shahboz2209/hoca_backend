import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Travels } from './models/travels.model';
import { InjectModel } from '@nestjs/sequelize';
import { TravelsDto } from './dto/travels.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class TravelsService {
  constructor(
    @InjectModel(Travels)
    private readonly travelsRepository: typeof Travels,
    private readonly fileService: FilesService,
  ) {}

  async create(travelsDto: TravelsDto, image: any) {
    try {
      if (image) {
        const file_name = await this.fileService.createFile(image);
        const data = await this.travelsRepository.create({
          ...travelsDto,
          image: file_name,
        });
        return {
          statusCode: HttpStatus.CREATED,
          travel: 'Travel created successfully!',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(error.travel);
    }
  }

  async findAll() {
    try {
      const data = await this.travelsRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.travel);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const travels = await this.travelsRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.travelsRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: travels,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.travel);
    }
  }

  async findById(id: string) {
    try {
      const data = await this.travelsRepository.findOne({
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
      throw new BadRequestException(error.travel);
    }
  }

  async update(id: string, travelsDto: TravelsDto, image: any) {
    try {
      const { data } = await this.findById(id);
      if (image) {
        const file_name = await this.fileService.createFile(image);
        const data = await this.travelsRepository.update(
          {
            ...travelsDto,
            image: file_name,
          },
          {
            where: { id },
            returning: true,
          },
        );
        return {
          statusCode: HttpStatus.CREATED,
          travel: 'Travel updated successfully!',
          data: data[1][0],
        };
      }
      return {
        statusCode: HttpStatus.NOT_FOUND,
        travel: 'Please fill all fields!',
      };
    } catch (error) {
      throw new BadRequestException(error.travel);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await this.findById(id);
      data.destroy();
      return {
        travel: 'Travel deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.travel);
    }
  }
}
