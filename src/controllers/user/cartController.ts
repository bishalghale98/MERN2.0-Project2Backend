import { Request, response, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import Cart from "../../database/models/Cart";
import Product from "../../database/models/Product";
import Category from "../../database/models/Category";

class CartController {
  // add To cart
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { quantity, productId } = req.body;
      if (!quantity || !productId) {
        res.status(400).json({
          message: "Please provide quantity & ProductId",
        });
      }

      // check if the product already exists or not

      let cartItem = await Cart.findOne({
        where: { productId, userId },
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await Cart.create({
          quantity,
          userId,
          productId,
        });
      }
      res.status(200).json({
        message: "Product add to cart",
        data: cartItem,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getMyCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const cartItem = await Cart.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: Product,
            include: [
              {
                model: Category,
                attributes: ["id", "categoryName"],
              },
            ],
          },
        ],
      });

      if (cartItem.length === 0) {
        res.status(404).json({
          message: "No item in a cart",
        });
        return;
      }
      res.status(200).json({
        message: "Cart item fetched successfully",
        data: cartItem,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async deleteMyCartItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;
      // check whether above productId product exist or not
      const product = await Product.findByPk(productId);

      if (!product) {
        res.status(404).json({
          message: "No product with that id",
        });
        return;
      }

      await Cart.destroy({
        where: {
          userId,
          productId,
        },
      });
      res.status(200).json({
        message: "Cart deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity) {
        res.status(400).json({
          message: " Please provide quantity",
        });
        return;
      }

      const cartData = await Cart.findOne({
        where: {
          userId,
          productId,
        },
      });

      if (!cartData) {
        res.status(404).json({
          message: "Cart item not found",
        });
        return;
      }

      cartData.quantity = quantity;
      await cartData?.save();
      res.status(200).json({
        message: " Cart updated successfully",
        data: cartData,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new CartController();
