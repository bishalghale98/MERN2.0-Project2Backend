import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

import * as dotenv from "dotenv";
dotenv.config();

import "./database/connection";

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Home Page",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.send({
    message: "About Page",
  });
});

app.get("/contact", (req: Request, res: Response) => {
  res.send({
    message: "Contact Page",
  });
});

app.listen(PORT, () => {
  console.log("server is running at port", PORT);
});
