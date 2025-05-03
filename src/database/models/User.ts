import { Table, Column, Model, DataType } from "sequelize-typescript";

enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.CUSTOMER),
    defaultValue: UserRole.CUSTOMER,
    validate: {
      isIn: {
        args: [[UserRole.ADMIN, UserRole.CUSTOMER]],
        msg: "Role must be 'admin' or 'customer'",
      },
    },
  })
  declare role: UserRole;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;
}

export default User;
