import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
} from "sequelize-typescript";

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
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
  })
  declare productDescription: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare productPrice: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare productQuantity: number;

  @Column({
    type: DataType.STRING,
  })
  declare productBrand: string;

  @Column({
    type: DataType.STRING,
  })
  declare productImage_url: string;

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected"),
    allowNull: true,
    defaultValue: "pending",
  })
  declare productStatus: ProductStatus;
}

export default Product;
