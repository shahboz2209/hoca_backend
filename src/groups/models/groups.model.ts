import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Student } from '../../student/models/student.model';
import { Test } from '../../tests/models/tests.model';

interface GroupAttr {
  id: string;
  name: string;
  description: string;
}

@Table({ tableName: 'Group' })
export class Group extends Model<Group, GroupAttr> {
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
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @HasMany(() => Student, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  students: Student[];

  @HasMany(() => Test, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  tests: Test[];
}
