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
  .route("")
  .post(adminMiddleware, categoryController.addCategory)
  .get(adminMiddleware, categoryController.getAllCategory);

router
  .route("/:id")
  .patch(adminMiddleware, categoryController.updateCategory)
  .delete(adminMiddleware, categoryController.deleteCategory);

export default router;
