import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^\d{10}$/,
        msg: "Phone number must be exactly 10 digits",
      },
    },
  })
  declare phoneNumber: string;

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
    type: DataType.ENUM(
      "pending",
      "cancelled",
      "delivered",
      "ontheway",
      "preparation"
    ),
    defaultValue: "pending",
  })
  declare orderStatus: number;
}

export default Order;
