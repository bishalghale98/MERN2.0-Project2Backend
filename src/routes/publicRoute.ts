import express, { Router } from "express";
import productController from "../controllers/user/productController";
import categoryController from "../controllers/user/categoryController";

const router: Router = express.Router();

router.route("/products").get(productController.getAllProducts);
router.route("/products/:id").get(productController.getProduct);

router.route("/category").get(categoryController.getAllCategory);

export default router;
