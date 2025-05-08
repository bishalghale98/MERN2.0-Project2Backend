import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import userRoute from "./routes/authRoutes/userRoute";
import productRoute from "./routes/adminRoutes/productRoute";
import userProductRoute from "./routes/userRoutes/userProductRoute";
import categoryRoute from "./routes/adminRoutes/categoryRoute"

import "./database/connection";

// Initialize environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adminRoutes
app.use("/", userRoute);
app.use("/", productRoute);
app.use("/", categoryRoute);


// publicRoutes
app.use("/", userProductRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
