export enum PaymentMethod {
  Cod = "cod",
  Khalti = "khalti",
  Esewa = "esewa",
}

enum paymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
}

export interface OrderData {
  phoneNumber: number;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus?: paymentStatus;
    pidx?: string;
  };
  items: OrderDetails[];
}

export interface OrderDetails {
  quantity: number;
  productId: string;
}

export interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}

export interface TransactionVerificationResponse {
  pidx: string;
  total_amount: number;
  status: TransactionStatus;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export enum TransactionStatus {
  Completed = "Completed",
  Refunded = "Refunded",
  Pending = "Pending",
  Initiated = "Initiated",
}
