import express, { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import { UserRole } from "../../database/models/User";
import errorHandler from "../../services/catchAsyncError";
import orderController from "../../controllers/user/orderController";

const router: Router = express.Router();

// only for User
const adminMiddleware = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.CUSTOMER),
];

router
  .route("/")
  .post(adminMiddleware, errorHandler(orderController.createOrder));

router
  .route("/verify")
  .post(adminMiddleware, errorHandler(orderController.verifyTransaction));

export default router;
