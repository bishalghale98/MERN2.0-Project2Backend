import { Request, Response } from "express";
import Product from "../database/models/Product";



class ProductController {
  public static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, price, quantity, brand, status } =
        req.body;

      await Product.create({
        name,
        description,
        price,
        quantity,
        brand,
        status,
        
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
}

export default ProductController;
