import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Student } from '../../student/models/student.model';
import { Test } from '../../tests/models/tests.model';

interface AnswerAttr {
  id: string;
  student_id: string;
  type: string;
  answer: string;
}

@Table({ tableName: 'Answer' })
export class Answer extends Model<Answer, AnswerAttr> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  answer: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string;

  @BelongsTo(() => Student)
  student: Student;
}
