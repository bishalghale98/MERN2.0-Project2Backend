import { Table, Column, Model, DataType } from "sequelize-typescript";

enum ProductStatus {
  ACTIVE = "accepted",
  INACTIVE = "pending",
  ARCHIVED = "rejected",
}

// "pending", "accepted", "rejected"

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @Column({
    type: DataType.STRING,
  })
  declare brand: string;

  @Column({
    type: DataType.STRING,
  })
  declare image_url: string;

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  })
  declare status: ProductStatus;
}

export default Product;
