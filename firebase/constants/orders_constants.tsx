import { PaymentMethodEnum, OrderStatusEnum } from "./enum_constants";
import { ShippingDetailsType } from "./user_constants";

export type PaymentType = {
  created_at: string;
  updated_at: string;
  payment_method: PaymentMethodEnum;

  price_paid?: number;
  date_cleared?: string;
};

export type ProductsInOrderType = {
  id: string;
  quantity: number;
};

export type OrdersDatabaseType = {
  id?: string;
  created_at?: string;
  updated_at?: string;

  total_price: number;
  date_cleared?: string;

  payment: PaymentType;
  products: ProductsInOrderType[];
  status: OrderStatusEnum;

  user_id?: string;
  note?: string;
  delivery_mode: string;
  shipping_details: ShippingDetailsType;
};

export type OrdersDatabaseFromDBType = {
  id: string;
  created_at: string;
  updated_at: string;

  total_price: number;
  date_cleared: string;

  payment: PaymentType;
  products: ProductsInOrderType[];
  status: OrderStatusEnum;

  user_id: string;
  note: string;
  delivery_mode: string;
  shipping_details: ShippingDetailsType;
};
