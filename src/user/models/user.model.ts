import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
// import { SocialNetwork } from '../../social-network/models/social-network.model';
// import { Product } from '../../product/models/product.model';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  image: string;
  full_name: string;
  desciption: string;
  address: string;
  birth_date: Date;
  isAlien: boolean;
  hashed_password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttributes> {
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
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  desciption: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.DATE,
  })
  birth_date: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAlien: boolean;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

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
