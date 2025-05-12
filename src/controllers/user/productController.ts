import { Request, Response } from "express";
import Product from "../../database/models/Product";
import User from "../../database/models/User";
import Category from "../../database/models/Category";
import { Op } from "sequelize";

class UserProductController {
  // getAllProducts
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.findAll({
        where: {
        productStatus: {
          [Op.notIn]: ["pending", "rejected"],
        },
      },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["id", "categoryName", "categorySlug"],
          },
        ],
      });

      if (!products || products.length === 0) {
        res.status(400).json({
          success: false,
          message: "No products found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching products",
        error: error.message,
      });
    }
  }

  // getSingleProduct
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Product ID is missing in request parameters",
        });
        return;
      }

      const product = await Product.findAll({
        where: {
          id,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["id", "categoryName", "categorySlug"],
          },
        ],
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Single Product fetched successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new UserProductController();
