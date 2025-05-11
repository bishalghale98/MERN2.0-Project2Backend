import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Category extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  declare phoneNumber: number;

  @Column({
    type: DataType.STRING,
  })
  declare shippingAddress: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM('pending', 'cancelled', 'delivered', 'ontheway', 'preparation'),
    defaultValue : 'pending'
  })
  declare orderStatus: number;
}

export default Category;
