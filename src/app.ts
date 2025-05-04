import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import adminSeeder from "./adminSeeder";
import "./database/connection";

// Initialize environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Run admin seeder
adminSeeder();

// Routes
app.use("/", userRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
