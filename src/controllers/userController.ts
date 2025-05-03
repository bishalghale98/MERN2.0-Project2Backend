import { Request, Response } from "express";
import User from "../database/models/User";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({
          message: "Please provide username, email, password",
        });
        return;
      }

      await User.create({
        username,
        email,
        password,
      });
      res.status(200).json({
        message: "User register successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong while registering user",
      });
    }
  }
}

export default AuthController;
