import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Test } from './models/tests.model';
import { TestDto } from './dto/tests.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test)
    private readonly TestRepository: typeof Test,
  ) {}

  async create(testDto: TestDto) {
    try {
      const test = await this.TestRepository.create(testDto);
      return {
        message: "Test qo'shildi",
        test,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const tests = await this.TestRepository.findAll({
        include: { all: true },
      });
      return tests;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const tests = await this.TestRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.TestRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: tests,
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
      const tests = await this.TestRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!tests) {
        throw new BadRequestException('Test topilmadi!');
      }
      return tests;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, testDto: TestDto) {
    try {
      const test = await this.findById(id);
      const updated_info = await this.TestRepository.update(testDto, {
        where: { id: test.id },
        returning: true,
      });
      return {
        message: "Test o'zgartirildi",
        test: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const test = await this.findById(id);
      test.destroy();
      return { message: "Test o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
