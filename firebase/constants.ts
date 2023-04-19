export const NOTIFICATION_STATES = {
  SUCCESS: "success",
  ERROR: "error",
};

export const ROLE_STATES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

export const PRODUCT_CATEGORIES = {
  OUTER_NUTRITION_VITAMIN_MASK: "Outer Nutrition - Vitamin Mask",
  OUTER_NUTRITION_HERBALIFE_NUTRITION_SKIN:
    "Outer Nutrition - Herbalife Nutrition Skin",
  HERBALIFE_NUTRITION_MEMBER_PACK: "Herbalife Nutrition Member Pack",
  HERBALIFE_NUTRITION_FOUNDATION_DONATION:
    "Herbalife Nutrition Foundation Donation",
  ART_OF_PROMOTION: "Art of Promotion",
  STANDARD_SERVICE_FEES: "Standard Service Fees",
  PRINTS_AND_LITERATURE: "Prints and Literature",
  INNER_NUTRITION_WEIGHT_MANAGEMENT_CORE_PRODUCTS:
    "Inner Nutrition - Weight Management - Core Products",
  INNER_NUTRITION_ENHANCERS: "Inner Nutrition - Enhancers",
  INNER_NUTRITION_HEART_HEALTH: "Inner Nutrition - Heart Health",
  INNER_NUTRITION_DIGESTIVE_HEALTH: "Inner Nutrition - Digestive Health",
  INNER_NUTRITION_WOMENS_HEALTH: "Inner Nutrition - Women's Health",
  INNER_NUTRITION_EYE_HEALTH: "Inner Nutrition - Eye Health",
  HERBALIFE_SPORTS_NUTRITION: "Herbalife - Sports Nutrition",
  PRODUCT_PACKS: "Product Packs",
  SEASONAL_PRODUCT_PACK: "Seasonal Product Pack",
  WEIGHT_LOSS_MARATHON_PACK: "Weight Loss Marathon Pack",
  SHAKES: "Shakes",
};

export const PRODUCT_CATEGORIES_ARRAY = [
  PRODUCT_CATEGORIES.OUTER_NUTRITION_VITAMIN_MASK,
  PRODUCT_CATEGORIES.OUTER_NUTRITION_HERBALIFE_NUTRITION_SKIN,
  PRODUCT_CATEGORIES.HERBALIFE_NUTRITION_MEMBER_PACK,
  PRODUCT_CATEGORIES.HERBALIFE_NUTRITION_FOUNDATION_DONATION,
  PRODUCT_CATEGORIES.ART_OF_PROMOTION,
  PRODUCT_CATEGORIES.STANDARD_SERVICE_FEES,
  PRODUCT_CATEGORIES.PRINTS_AND_LITERATURE,
  PRODUCT_CATEGORIES.INNER_NUTRITION_WEIGHT_MANAGEMENT_CORE_PRODUCTS,
  PRODUCT_CATEGORIES.INNER_NUTRITION_ENHANCERS,
  PRODUCT_CATEGORIES.INNER_NUTRITION_HEART_HEALTH,
  PRODUCT_CATEGORIES.INNER_NUTRITION_DIGESTIVE_HEALTH,
  PRODUCT_CATEGORIES.INNER_NUTRITION_WOMENS_HEALTH,
  PRODUCT_CATEGORIES.INNER_NUTRITION_EYE_HEALTH,
  PRODUCT_CATEGORIES.HERBALIFE_SPORTS_NUTRITION,
  PRODUCT_CATEGORIES.PRODUCT_PACKS,
  PRODUCT_CATEGORIES.SEASONAL_PRODUCT_PACK,
  PRODUCT_CATEGORIES.WEIGHT_LOSS_MARATHON_PACK,
  PRODUCT_CATEGORIES.SHAKES,
];
enum Role {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export interface FunctionResult {
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
  id?: string;
  contact_number?: string;
  created_at?: string;
  email: string;
  role?: Role;
  shipping_details?: ShippingDetailsType;
  updated_at?: string;
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
  id?: string;
  created_at?: string;
  date_cleared?: string;
  payment: PaymentType;
  products: ProductsInOrderType[];
  status: OrderStatusEnum;
  total_price: number;
  updated_at?: string;
  user_id: string;
}

export interface ProductsDatabaseType {
  id?: string;
  name: string;
  category: string;
  created_at?: string;
  description: string;
  price: number;
  quantity_left: number;
  quantity_in_carts?: number;
  quantity_sold?: number;
  updated_at?: string;
  images: any[];
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
  id?: string;
  created_at?: string;
  products: ProductsInCartsType[];
  subtotal_price: number;
  updated_at?: string;
  user_id: string;
}
