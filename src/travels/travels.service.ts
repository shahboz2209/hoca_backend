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

  async create(travelsDto: TravelsDto, source: any) {
    try {
      if (source) {
        const file_name = await this.fileService.createFile(source);
        const data = await this.travelsRepository.create({
          ...travelsDto,
          source: file_name,
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

  async update(id: string, travelsDto: TravelsDto) {
    try {
      const {data} = await this.findById(id);
      const updated_info = await this.travelsRepository.update(travelsDto, {
        where: { id: data.id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        travel: 'Updated travel',
        data: updated_info[1][0],
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
