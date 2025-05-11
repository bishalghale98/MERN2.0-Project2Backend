import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import userRoute from "./routes/authRoutes/userRoute";
import productRoute from "./routes/adminRoutes/productRoute";
import publicRoute from "./routes/publicRoute";
import categoryRoute from "./routes/adminRoutes/categoryRoute";
import cartRoute from "./routes/userRoutes/cartRoute";

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
app.use("/admin/products", productRoute);
app.use("/admin/category", categoryRoute);

// login user
app.use("/customer/cart", cartRoute);


// publicRoutes
app.use("/", publicRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
