import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from '../../groups/models/groups.model';

interface TestAttr {
  id: number;
  title: string;
  test_count: number;
  min_ball: number;
  start_time: Date;
  end_time: Date;
  is_time: boolean;
  is_message: boolean;
  variants: string;
  answers: string;
  group_id: string;
}

@Table({ tableName: 'Test' })
export class Test extends Model<Test, TestAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
  })
  test_count: number;

  @Column({
    type: DataType.INTEGER,
  })
  min_ball: number;

  @Column({
    type: DataType.DATE,
  })
  start_time: Date;

  @Column({
    type: DataType.DATE,
  })
  end_time: Date;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_time: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_message: boolean;

  @Column({
    type: DataType.STRING,
  })
  variants: string;

  @Column({
    type: DataType.STRING,
  })
  answers: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;
}
