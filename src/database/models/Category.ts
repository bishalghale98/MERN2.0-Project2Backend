import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";


@Table({
  tableName: "categories",
  modelName: "Category",
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
    type: DataType.STRING,
    allowNull: false,
  })
  declare categoryName: string;

  @Column({
    type: DataType.TEXT,
  })
  declare categorySlug: string;

}

export default Category;
