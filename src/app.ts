import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

// to access .env file
import * as dotenv from "dotenv";
dotenv.config();

// make connection of database
import "./database/connection";

import userRoute from "./routes/userRoute";

// for use json type data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//give access to use the userRoute folder from frontend
app.use("", userRoute);

app.listen(PORT, () => {
  console.log("server is running at port", PORT);
});
