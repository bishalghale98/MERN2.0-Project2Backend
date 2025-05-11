import express, { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import { UserRole } from "../../database/models/User";
import cartController from "../../controllers/user/cartController";

const router: Router = express.Router();

// only for User
const adminMiddleware = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.CUSTOMER),
];

router
  .route("")
  .post(adminMiddleware, cartController.addToCart)
  .get(adminMiddleware, cartController.getMyCart);

router
  .route("/:productId")
  .delete(adminMiddleware, cartController.deleteMyCartItem)
  .patch(adminMiddleware, cartController.updateCartItem);

export default router;
