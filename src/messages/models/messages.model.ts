import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
// import { Product } from '../../product/models/product.model';

interface MessagesAttrs {
  id: string;
  title: string;
  description: string;
  source: string;
}

@Table({ tableName: 'messages' })
export class Messages extends Model<Messages, MessagesAttrs> {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source: string;

  // @HasMany(() => Product, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // product: Product[];
}
