import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Answer } from './models/answers.model';
import { AnswerDto } from './dto/answers.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer)
    private readonly AnswerRepository: typeof Answer,
  ) {}

  async create(answerDto: AnswerDto) {
    try {
      const answer = await this.AnswerRepository.create(answerDto);
      return {
        message: "Answer qo'shildi",
        answer,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const answers = await this.AnswerRepository.findAll({
        include: { all: true },
      });
      return answers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const answers = await this.AnswerRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.AnswerRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: answers,
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
      const answers = await this.AnswerRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!answers) {
        throw new BadRequestException('Answer topilmadi!');
      }
      return answers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, answerDto: AnswerDto) {
    try {
      const answer = await this.findById(id);
      const updated_info = await this.AnswerRepository.update(answerDto, {
        where: { id: answer.id },
        returning: true,
      });
      return {
        message: "Answer o'zgartirildi",
        answer: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const answer = await this.findById(id);
      answer.destroy();
      return { message: "Answer o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
