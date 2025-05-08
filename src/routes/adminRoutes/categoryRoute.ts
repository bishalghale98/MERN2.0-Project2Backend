import express, { Router } from "express";
import { UserRole } from "../../database/models/User";
import authMiddleware from "../../middleware/authMiddleware";
import categoryController from "../../controllers/admin/categoryController";

const router: Router = express.Router();

// only for admin
const adminMiddleware = [
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo(UserRole.ADMIN),
];

router
  .route("/admin/categories")
  .post(adminMiddleware, categoryController.addCategory);

export default router;
