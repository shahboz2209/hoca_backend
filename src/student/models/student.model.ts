/* eslint-disable prettier/prettier */
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
import { Answer } from '../../answers/models/answers.model';
// import { SocialNetwork } from '../../social-network/models/social-network.model';
// import { Product } from '../../product/models/product.model';
// import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface StudentAttributes {
  id: string;
  full_name: string;
  username: string;
  start_date: Date;
  student_id: number;
  group_id: string;
  phone: string;
  address: string;
  image: string;
  email: string;
  hashed_password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: 'student' })
export class Student extends Model<Student, StudentAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    unique: true,
    defaultValue: new Date(),
  })
  start_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  student_id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Answer, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  answers: Answer[];

  // @HasMany(() => SocialNetwork, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // social_network: SocialNetwork[];

  // @HasMany(() => Product, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // product: Product[];

  // @HasMany(() => SoldProduct, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // sold_product: SoldProduct[];
}
