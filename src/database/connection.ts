import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
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

sequelize.sync({ force: false }).then(() => {
  console.log("Table created");
});

export default sequelize;
