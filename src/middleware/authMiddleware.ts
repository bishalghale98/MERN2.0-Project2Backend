import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../database/models/User";

interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // get token from user
    const token = req.headers.authorization;

    if (!token || token == undefined) {
      res.status(403).json({
        message: "Token not provided",
      });
      return;
    }
    // verify token if it is legit  or tampered
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err, decode: any) => {
        if (err) {
          res.status(403).json({
            message: "invalid token",
          });
        } else {
          try {
            // check that decoded id user exist or not
            const userData = await User.findByPk(decode.id);
            if (!userData) {
              res.status(404).json({
                message: "No user with that token",
              });
              return;
            }
            req.user = userData;
            // next
            next();
          } catch (error) {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        }
      }
    );
  }

  restrictTo(...roles: UserRole[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as UserRole;
      console.log(userRole);
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "you don't have permission",
        });
      } else {
        next();
      }
    };
  }
}

export default new AuthMiddleware();
