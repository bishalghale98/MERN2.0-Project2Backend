import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  paymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../../types/OrderTypes";
import Order from "../../database/models/Order";
import Payment from "../../database/models/Payment";

import axios from "axios";
import Product from "../../database/models/Product";
import { json } from "sequelize";
import OrderDetail from "../../database/models/OrderDetail";

class ExtendedOrder extends Order {
  declare paymentId: string | null;
}

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const {
        phoneNumber,
        shippingAddress,
        totalAmount,
        paymentDetails,
        items,
      }: OrderData = req.body;

      if (
        !phoneNumber ||
        !shippingAddress ||
        !totalAmount ||
        !paymentDetails.paymentMethod ||
        items.length == 0
      ) {
        res.status(400).json({
          message:
            "Please Provide phoneNumber, shippingAddress, totalAmount, paymentDetails & items",
        });
        return;
      }

      const paymentData = await Payment.create({
        paymentMethod: paymentDetails.paymentMethod,
      });

      const orderData = await Order.create({
        phoneNumber,
        shippingAddress,
        totalAmount,
        userId,
        paymentId: paymentData.id,
      });

      for (var i = 0; i < items.length; i++) {
        await OrderDetail.create({
          quantity: items[i].quantity,
          productId: items[i].productId,
          orderId: orderData.id,
        });
      }

      if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
        // khalti integration
        const data = {
          return_url: "http://localhost:3000/success",
          purchase_order_id: orderData.id,
          amount: totalAmount * 100,
          website_url: "http://localhost:3000",
          purchase_order_name: "orderName_" + orderData.id,
        };

        const response = await axios.post(
          "https://dev.khalti.com/api/v2/epayment/initiate/",
          data,
          {
            headers: {
              Authorization: "key b540a86f2796459683b81cdaf2cf30c9",
            },
          }
        );

        const KhaltiResponse: KhaltiResponse = response.data;

        paymentData.pidx = KhaltiResponse.pidx;

        paymentData.save();

        res.status(200).json({
          message: "Order placed successfully",
          url: KhaltiResponse.payment_url,
        });
        return;
      }

      res.status(200).json({
        message: "Order placed successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    const userId = req.user?.id;
    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        pidx,
      },
      {
        headers: {
          Authorization: "key b540a86f2796459683b81cdaf2cf30c9",
        },
      }
    );

    const data: TransactionVerificationResponse = response.data;

    if (data.status === TransactionStatus.Completed) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx,
          },
        }
      );
      res.status(200).json({
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        message: "Payment not verified",
      });
    }
  }

  // customer side starts here
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Payment,
        },
      ],
    });

    if (orders.length === 0) {
      res.status(404).json({
        message: "You haven't ordered anything yet..",
        data: [],
      });
      return;
    }

    res.status(200).json({
      message: " Order fetched successfully",
      data: orders,
    });
  }

  async fetchOrderDetail(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;

    const orderDetail = await OrderDetail.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });

    if (orderDetail.length === 0) {
      res.status(404).json({
        message: "no any orderDetail with that id",
        data: [],
      });
      return;
    }

    res.status(200).json({
      message: " orderDetail fetched successfully",
      data: orderDetail,
    });
  }

  async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;

    const order: any = await Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });

    if (
      order.orderStatus === OrderStatus.Ontheway ||
      order.orderStatus === OrderStatus.Preparation
    ) {
      res.status(200).json({
        message: "you cannot cancel order when it is in ontheway or prepared",
      });
      return;
    }

    await Order.update(
      { orderStatus: OrderStatus.Cancelled },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order cancel successfully",
    });
  }

  // customer side ends here

  // Admin side starts here

  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.orderStatus;
    await Order.update(
      {
        orderStatus: orderStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );

    res.status(200).json({
      message: "Order status updated successfully",
    });
  }

  async changePaymentStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus: paymentStatus = req.body.paymentStatus;

    const order = await Order.findByPk(orderId);

    const ExtendedOrder: ExtendedOrder = order as ExtendedOrder;

    await Payment.update(
      {
        paymentStatus: paymentStatus,
      },
      {
        where: {
          id: ExtendedOrder.paymentId,
        },
      }
    );
    res.status(200).json({
      message: `Payment status of orderId ${orderId} updated successfully to ${paymentStatus}`,
    });
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    const ExtendedOrder: ExtendedOrder = order as ExtendedOrder;

    if (!order) {
      res.status(404).json({
        message: "No order with that id",
      });
      return;
    }

    if (order) {
      await OrderDetail.destroy({
        where: {
          orderId,
        },
      });

      await Payment.destroy({
        where: {
          id: ExtendedOrder.paymentId,
        },
      });

      await Order.destroy({
        where: {
          id: orderId,
        },
      });
    }
    res.status(200).json({
      message: "Order deleted Successfully",
    });
  }
}

export default new OrderController();
