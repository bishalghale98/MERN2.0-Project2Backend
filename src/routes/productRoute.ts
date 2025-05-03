import express, { Router } from "express";
import ProductController from "../controllers/productController";

const router: Router = express.Router();


// Product add routes
router
  .route("/products")
  .post(ProductController.addProduct);
