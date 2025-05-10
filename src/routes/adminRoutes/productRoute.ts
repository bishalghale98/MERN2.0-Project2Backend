import express, { Router } from "express";
import { UserRole } from "../../database/models/User";
import authMiddleware from "../../middleware/authMiddleware";
import productController from "../../controllers/admin/productController";
import { upload } from "../../middleware/multerMiddleware";

const router: Router = express.Router();

// only for admin
const adminMiddleware = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.ADMIN),
];

router
  .route("")
  .post(
    [...adminMiddleware, upload.single("image")],
    productController.addProduct
  ) //addProduct
  .get(adminMiddleware, productController.getAllProducts); //getAllProducts

router
  .route("/:id")
  .get(adminMiddleware, productController.getProduct) //getSingleProduct
  .patch(
    [...adminMiddleware, upload.single("image")],
    productController.updateProduct
  ) // update product
  .delete(adminMiddleware, productController.deleteProduct); //deleteProduct

export default router;
