import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
// import { Product } from '../../product/models/product.model';

interface JobsAttrs {
  id: string;
  company: string;
  salary: string;
  visa: string;
  image: string;
}

@Table({ tableName: 'jobs' })
export class Jobs extends Model<Jobs, JobsAttrs> {
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
  company: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  salary: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  visa: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  // @HasMany(() => Product, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // product: Product[];
}
