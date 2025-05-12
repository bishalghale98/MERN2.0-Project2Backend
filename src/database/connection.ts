import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import adminSeeder from "../adminSeeder";
import categoryController from "../controllers/admin/categoryController";
import defineRelations from "./dbRelations";
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

defineRelations();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Table created");
  })
  .then(() => {
    adminSeeder();
    categoryController.seedCategory();
  });

export default sequelize;
