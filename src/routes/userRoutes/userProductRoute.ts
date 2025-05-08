import express, { Router } from "express";
import productController from "../../controllers/user/productController";

const router: Router = express.Router();

router
  .route("/products")
  .get(productController.getAllProducts)
  .get(productController.getProduct);

export default router;
