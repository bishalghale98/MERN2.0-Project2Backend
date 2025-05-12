import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import {
  KhaltiResponse,
  OrderData,
  PaymentMethod,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../../types/OrderTypes";
import Order from "../../database/models/Order";
import Payment from "../../database/models/Payment";
import OrderDetails from "../../database/models/OrderDetails";
import axios from "axios";

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
        await OrderDetails.create({
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
}

export default new OrderController();
