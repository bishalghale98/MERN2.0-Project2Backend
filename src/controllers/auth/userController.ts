import { Request, response, Response } from "express";
import User from "../../database/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username, email, password",
      });
      return;
    }

    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (data) {
      res.status(409).json({
        message: "Email already register",
      });
      return;
    }

    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 12),
      role: role,
    });
    res.status(200).json({
      message: "User register successfully",
    });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    // user input
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    // check whether user with above email exist or not

    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });

    // email not match
    if (!data) {
      res.status(404).json({
        message: "Email and password does not match",
      });
      return;
    }

    // compare password
    const isMatched = bcrypt.compareSync(password, data.password);
    if (!isMatched) {
      res.status(404).json({
        message: "Email and password does not match",
      });
      return;
    }
    // generate token and sent to user
    const token = jwt.sign(
      {
        id: data.id,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "20d" }
    );
    res.status(200).json({
      message: "Logged in successfully",
      data: token,
    });
  }
}

export default AuthController;
