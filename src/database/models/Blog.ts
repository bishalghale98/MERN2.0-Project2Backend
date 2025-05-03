import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "blogs",
  modelName: "Blog",
})
class Blog extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare title: string;
}

export default Blog;
