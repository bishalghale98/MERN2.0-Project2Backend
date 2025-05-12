import express, { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import { UserRole } from "../../database/models/User";
import errorHandler from "../../services/catchAsyncError";
import orderController from "../../controllers/user/orderController";

const router: Router = express.Router();

// only for User
const customerOnly = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.CUSTOMER),
];

const adminOnly = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.ADMIN),
];

const customerOrAdmin = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.CUSTOMER, UserRole.ADMIN),
];

router.route("/").post(customerOnly, errorHandler(orderController.createOrder));

router
  .route("/verify")
  .post(customerOnly, errorHandler(orderController.verifyTransaction));

// customer side route

router
  .route("/me")
  .get(customerOrAdmin, errorHandler(orderController.fetchMyOrders));

router
  .route("/:id")
  .patch(customerOnly, errorHandler(orderController.cancelMyOrder))
  .get(customerOnly, errorHandler(orderController.fetchOrderDetails));

// Admin Routes
router
  .route("/admin/:id")
  .patch(adminOnly, errorHandler(orderController.changeOrderStatus))
  .delete(adminOnly, errorHandler(orderController.deleteOrder));

router
  .route("/admin/payment/:id")
  .patch(adminOnly, errorHandler(orderController.changePaymentStatus));


export default router;
