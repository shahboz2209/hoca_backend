import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
// import { Product } from '../../product/models/product.model';

interface TravelsAttrs {
  id: string;
  departure_date: Date;
  arrival_date: Date;
  image: string;
  cost: string;
}

@Table({ tableName: 'travels' })
export class Travels extends Model<Travels, TravelsAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  departure_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  arrival_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  destinations: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cost: string;
}
