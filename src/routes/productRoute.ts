import express, { Router } from "express";
import ProductController from "../controllers/productController";
import errorHandler from "../services/catchAsyncError";

const router: Router = express.Router();

// Product add routes
router.route("/products").post(errorHandler(ProductController.addProduct));
