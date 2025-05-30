import express, { Router } from "express";
import AuthController from "../../controllers/auth/userController";
import errorHandler from "../../services/catchAsyncError";
const router: Router = express.Router();

// userRegister routes
router.route("/register").post(errorHandler(AuthController.registerUser));
router.route("/login").post(errorHandler(AuthController.loginUser));

export default router;
