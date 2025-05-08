import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import adminSeeder from "../adminSeeder";
import Product from "./models/Product";
import User from "./models/User";
import Category from "./models/Category";
import categoryController from "../controllers/admin/categoryController";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Table created");
  })
  .then(() => {
    adminSeeder();
    categoryController.seedCategory();
  });

// Relationships

// Product & User Relation
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

// Product & Category Relation
Category.hasOne(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

export default sequelize;
