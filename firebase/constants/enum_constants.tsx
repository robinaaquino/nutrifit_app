export enum ResultTypeEnum {
  TEXT = "text",
  ARRAY = "array",
  OBJECT = "object",
  NULL = "null",
  BOOLEAN = "boolean",
}

export enum NotificationEnum {
  SUCCESS = "success",
  ERROR = "error",
}

export enum RoleEnum {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export enum WellnessRemarksEnum {
  GAIN = "Weight Gain Program",
  LOSS = "Weight Loss Program",
  MAINTENANCE = "Weight Maintenance Program",
  BLANK = "",
}

export enum PaymentMethodEnum {
  GCASH = "gcash",
  BANK_TRANSFER = "bank_transfer",
  PAYMAYA = "paymaya",
  PAYMENT_UPON_PICK_UP = "payment_upon_pick_up",
  BLANK = "",
}

export enum OrderStatusEnum {
  PENDING = "pending",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum MessageStatusEnum {
  UNREAD = "unread",
  REPLIED = "replied",
}

export enum CollectionsEnum {
  USER = "users",
  PRODUCT = "products",
  WELLNESS = "results",
  ORDER = "orders",
  MESSAGE = "messages",
  CART = "carts",
}
