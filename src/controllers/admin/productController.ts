import { Request, response, Response } from "express";
import Product from "../../database/models/Product";
import * as fs from "fs";
import { promisify } from "util";
import path from "path";
import { AuthRequest } from "../../middleware/authMiddleware";
import User from "../../database/models/User";
import Category from "../../database/models/Category";

const unlinkAsync = promisify(fs.unlink);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

interface IProductUpdateRequest {
  productName: string;
  productDescription?: string;
  productPrice: number;
  productQuantity: number;
  productBrand?: string;
  categoryId?: string;
}

class ProductController {
  // add product
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productBrand,
        categoryId,
      } = req.body as IProductUpdateRequest;

      if (!productName || !productDescription || !productPrice || !categoryId) {
        res.status(400).json({
          message:
            "Please enter the Product Name, Category, Product Description & Product Price",
        });
      }

      const fileSize: any = req.file?.size; // Get the file size

      // Check if file size exceeds allowed limit
      if (fileSize > MAX_FILE_SIZE) {
        res.status(400).json({
          success: false,
          message: "File size exceeds the 5 MB limit",
        });
        return;
      }

      // Continue processing the file if the size is acceptable

      let fileName: string;

      if (req.file) {
        fileName = req.file.filename;
      } else {
        fileName =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtGbK124YYWfS6_Rdjicw9MBjmWveXQCrK6A&s";
      }

      await Product.create({
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productBrand,
        productImage_url: fileName,
        userId: req.user?.id,
        categoryId: categoryId,
      });

      res.status(200).json({
        message: "Product added successfully",
      });

      return;
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
      return;
    }
  }

  // getall product
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: User,
            attributes: ["email", "username"],
          },
          {
            model: Category,
            attributes: ["categoryName", "categorySlug"],
          },
        ],
      });

      if (!products || products.length === 0) {
        res.status(404).json({
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
            attributes: ["id", "username", "email"],
          },
          {
            model: Category,
            attributes: ["id", "categoryName", "categorySlug"],
          },
        ],
      });

      if (!product || product.length == 0) {
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
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // updateProduct
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const {
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productBrand,
        categoryId,
      } = req.body as IProductUpdateRequest;

      const oldProduct = await Product.findByPk(id);

      if (req.file) {
        try {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "uploads",
            oldProduct?.productImage_url as string
          );
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
          // Don't fail the entire operation if image deletion fails
        }
      }

      const fileSize: any = req.file?.size;

      // Check if file size exceeds allowed limit
      if (fileSize > MAX_FILE_SIZE) {
        res.status(400).json({
          success: false,
          message: "File size exceeds the 5 MB limit",
        });
        return;
      }

      // Continue processing the file if the size is acceptable

      let fileName: string;

      if (req.file) {
        fileName = req.file?.filename;
      } else {
        fileName = oldProduct?.productImage_url as string;
      }

      const finalCategoryId =
        categoryId ?? (oldProduct?.getDataValue("categoryId") as string);

      await Product.update(
        {
          productName,
          productDescription,
          productPrice,
          productQuantity,
          productBrand,
          productImage_url: fileName,
          categoryId: finalCategoryId,
        },
        { where: { id } }
      );
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  // deleteProduct
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      if (product.productImage_url) {
        try {
          const imagePath = path.join(
            __dirname,
            "../uploads",
            product.productImage_url
          );
          await unlinkAsync(imagePath);
        } catch (error: any) {
          console.error("Error deleting product image:", error);
          // Continue with product deletion even if image deletion fails
        }
      }

      await Product.destroy({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: "Product successfully deleted",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProductController();
