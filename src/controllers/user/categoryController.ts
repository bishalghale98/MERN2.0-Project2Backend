import { Request, Response } from "express";
import Category from "../../database/models/Category";

class categoryController {
  async getAllCategory(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.findAll();

      if (!categories || categories.length == 0) {
        res.status(404).json({
          success: false,
          message: "No category has found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Category Fetch successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new categoryController();
