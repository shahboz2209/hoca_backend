import { Column, DataType, Model, Table, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Messages } from '../../messages/models/messages.model';
// import { Product } from '../../product/models/product.model';

interface DislikesAttrs {
  id: string;
  dislikes: number;
  user_id: string;
  message_id: string;
}

@Table({ tableName: 'dislikes' })
export class Dislikes extends Model<Dislikes, DislikesAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dislikes: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id: string;

  @BelongsTo(() => User)
  users: User;

  @ForeignKey(() => Messages)
  @Column({
    type: DataType.UUID,
  })
  message_id: string;

  @BelongsTo(() => Messages)
  messages: Messages;
}
