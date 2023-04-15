export const NOTIFICATION_STATES = {
  SUCCESS: "success",
  ERROR: "error",
};

export const ROLE_STATES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

enum Role {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export interface functionResult {
  result: any;
  isSuccess: Boolean;
  resultText: string;
  errorMessage: string;
}

export interface ShippingDetailsType {
  address: string;
  first_name: string;
  last_name: string;
  municipality: string;
  province: string;
}

export interface UsersDatabaseType {
  contact_number: string;
  created_at: string;
  email: string;
  role: Role;
  shipping_details: ShippingDetailsType;
  updated_at: string;
}

enum PaymentMethodEnum {
  GCASH = "gcash",
  BANK_TRANSFER = "bank_transfer",
  PAYMAYA = "paymaya",
  PAYMENT_UPON_PICK_UP = "payment_upon_pick_up",
}

export interface PaymentType {
  created_at: string;
  date_cleared: string;
  payment_method: PaymentMethodEnum;
  price_paid: number;
  updated_at: string;
}

export interface ProductsInOrderType {
  product_id: string;
  quantity: number;
}

enum OrderStatusEnum {
  PENDING = "pending",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrdersDatabaseType {
  created_at: string;
  date_cleared: string;
  payment: PaymentType;
  products: ProductsInOrderType[];
  status: OrderStatusEnum;
  total_price: number;
  updated_at: string;
  user_id: string;
}

export interface ProductsDatabaseType {
  category: string;
  created_at: string;
  description: string;
  price: number;
  quantity_left: number;
  quantity_in_carts: number;
  quantity_sold: number;
  updated_at: string;
}

export interface ProductsInCartsType {
  product_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
}

export interface CartsDatabaseType {
  created_at: string;
  products: ProductsInCartsType[];
  subtotal_price: number;
  updated_at: string;
  user_id: string;
}
