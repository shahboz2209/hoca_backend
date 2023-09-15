import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Jobs } from './models/jobs.model';
import { InjectModel } from '@nestjs/sequelize';
import { JobsDto } from './dto/jobs.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs)
    private readonly jobsRepository: typeof Jobs,
    private readonly fileService: FilesService,
  ) {}

  async create(jobsDto: JobsDto, image: any) {
    try {
      if (image) {
        const file_name = await this.fileService.createFile(image);
        if (image) {
          const file_name = await this.fileService.createFile(image);
          const created_info = await this.jobsRepository.create({
            ...jobsDto,
            image: file_name,
          });
          return {
            statusCode: HttpStatus.CREATED,
            message: 'Created job',
            data: created_info,
          };
        }
        const data = await this.jobsRepository.create({
          ...jobsDto,
        });
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Job created successfully!',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.jobsRepository.findAll({
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
      const jobs = await this.jobsRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.jobsRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: jobs,
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
      const data = await this.jobsRepository.findOne({
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

  async update(id: string, jobsDto: JobsDto, image: any) {
    try {
      const { data } = await this.findById(id);
      if (image) {
        const file_name = await this.fileService.createFile(image);
        const data = await this.jobsRepository.update(
          {
            ...jobsDto,
            image: file_name,
          },
          {
            where: { id },
            returning: true,
          },
        );
        return {
          statusCode: HttpStatus.OK,
          travel: 'Job updated successfully!',
          data: data[1][0],
        };
      }
      const updated_info = await this.jobsRepository.update(jobsDto, {
        where: { id: data.id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated job',
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
        message: 'Job deleted successfully!',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
