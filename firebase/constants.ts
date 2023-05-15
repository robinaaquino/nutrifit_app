export const NOTIFICATION_STATES = {
  SUCCESS: "success",
  ERROR: "error",
};

export const ROLE_STATES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

export enum ProductCategoryEnum {
  OUTER_NUTRITION_VITAMIN_MASK = "Vitamin Mask",
  OUTER_NUTRITION_HERBALIFE_NUTRITION_SKIN = "Herbalife Nutrition Skin",
  HERBALIFE_NUTRITION_MEMBER_PACK = "Member Pack",
  HERBALIFE_NUTRITION_FOUNDATION_DONATION = "Foundation",
  ART_OF_PROMOTION = "Promotional Materials",
  STANDARD_SERVICE_FEES = "Fees",
  PRINTS_AND_LITERATURE = "Standard Prints",
  INNER_NUTRITION_WEIGHT_MANAGEMENT_CORE_PRODUCTS = "Weight Management",
  INNER_NUTRITION_ENHANCERS = "Enhancers",
  INNER_NUTRITION_HEART_HEALTH = "Heart Health",
  INNER_NUTRITION_DIGESTIVE_HEALTH = "Digestive Health",
  INNER_NUTRITION_WOMENS_HEALTH = "Women's Health",
  INNER_NUTRITION_EYE_HEALTH = "Eye Health",
  HERBALIFE_SPORTS_NUTRITION = "Sports Nutrition",
  PRODUCT_PACKS = "Product Packs",
  SEASONAL_PRODUCT_PACK = "Seasonal Product Pack",
  WEIGHT_LOSS_MARATHON_PACK = "Weight Loss Marathon Pack",
  SHAKES = "Shakes",
}

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

export const PRODUCT_CATEGORIES_PUBLIC_NAME: any = {
  "Outer Nutrition - Vitamin Mask": "Vitamin Mask",
  "Outer Nutrition - Herbalife Nutrition Skin": "Herbalife Nutrition Skin",
  "Herbalife Nutrition Member Pack": "Member Pack",
  "Herbalife Nutrition Foundation Donation": "Foundation",
  "Art of Promotion": "Promotional Materials",
  "Standard Service Fees": "Fees",
  "Prints and Literature": "Standard Prints",
  "Inner Nutrition - Weight Management - Core Products": "Weight Management",
  "Inner Nutrition - Enhancers": "Enhancers",
  "Inner Nutrition - Heart Health": "Heart Health",
  "Inner Nutrition - Digestive Health": "Digestive Health",
  "Inner Nutrition - Women's Health": "Women's Health",
  "Inner Nutrition - Eye Health": "Eye Health",
  "Herbalife - Sports Nutrition": "Sports Nutrition",
  "Product Packs": "Product Packs",
  "Seasonal Product Pack": "Seasonal Product Pack",
  "Weight Loss Marathon Pack": "Weight Loss Marathon Pack",
  Shakes: "Shakes",
};

export const PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY = [
  "Vitamin Mask",
  "Herbalife Nutrition Skin",
  "Member Pack",
  "Foundation",
  "Promotional Materials",
  "Fees",
  "Standard Prints",
  "Weight Management",
  "Enhancers",
  "Heart Health",
  "Digestive Health",
  "Women's Health",
  "Eye Health",
  "Sports Nutrition",
  "Product Packs",
  "Seasonal Product Pack",
  "Weight Loss Marathon Pack",
  "Shakes",
];

export interface WellnessCustomerInformationUser {
  userId: string;
  email: string;
}

//TODO
export const WellnessQuestions: { [key: string]: string } = {
  tired: "Do you easily get tired?",
  sick: "Do you feel sick or get sick often?",
  chronicHealthProblems:
    "Do you suffer from chronic health problems such as headaches, backaches or constipation?",
  stressed: "Do you feel your workplace-home-life stressful?",
  constantlyHungry:
    "Do you often feel hungry or have a constant craving for food?",
  processedFood:
    "Do yo eat fast food, instant food or processed food regularly?",
  connectionFoodLevel:
    "Do you believe there is a connection between the food you eat and the level of your health?",
  eightWater: "Do you drink at least eight glass of plain water each day?",
  doctorLoseWeight: "Have your doctor suggested that you lose weight?",
  wantsToLoseWeight: "Would you like to lose excess inches and pounds?",
  wantsToAddWeight: "Would you like to add some pounds to your weight?",
  smoking: "Do you smoke?",
  alcohol: "Do you drink alcohol?",
};

export interface WellnessCustomerInformation {
  name: string;
  contact_number: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  user_information: WellnessCustomerInformation;
}

export const WellnessTrainerInformation: { [key: string]: string } = {
  date: "Date",
  fat: "Fat %",
  visceral_fat: "Visceral Fat",
  bone_mass: "Bone Mass",
  resting_metabolic_rate: "Resting Metabolic Rate (Calories burned at rest)",
  metabolic_age: "Metabolic Age",
  muscle_mass: "Muscle Mass",
  physique_rating: "Physique Rating",
  water: "Water %",
};

export interface WellnessTrainerInformationType {
  date: string;
  fat: string;
  visceral_fat: string;
  bone_mass: string;
  resting_metabolic_rate: string;
  metabolic_age: string;
  muscle_mass: string;
  physique_rating: string;
  water: string;
}

export interface WellnessRemarksType {
  present_weight: number;
  ideal_weight: number;
  weight_status: string;
  weight_status_number: number;
  ideal_visceral: number;
}

export enum WellnessRemarks {
  GAIN = "Weight Gain Program",
  LOSS = "Weight Loss Program",
  MAINTENANCE = "Weight Maintenance Program",
  BLANK = "",
}

export interface WellnessOverallResults {
  id?: string;
  user_id?: string;
  wellness_survey: [];
  name: string;
  contact_number: string;
  gender?: string;
  height: number;
  age: number;
  weight: number;

  reviewed_by_admin?: boolean;
  wellness_trainer_information?: WellnessTrainerInformationType;
  wellness_remarks?: WellnessRemarksType;
  program?: WellnessRemarks;
  meal_plan?: string;

  created_at?: string;
  updated_at?: string;
}

export enum RoleEnum {
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
  city: string;
  province: string;
  contact_number?: string;
}

export interface UsersDatabaseType {
  id: string;
  contact_number?: string;
  created_at?: string;
  updated_at?: string;
  email: string;
  role?: RoleEnum;
  shipping_details?: ShippingDetailsType;
  image?: string | File;
}

export enum PaymentMethodEnum {
  GCASH = "gcash",
  BANK_TRANSFER = "bank_transfer",
  PAYMAYA = "paymaya",
  PAYMENT_UPON_PICK_UP = "payment_upon_pick_up",
  BLANK = "",
}

export interface PaymentType {
  created_at: string;
  date_cleared?: string;
  payment_method: PaymentMethodEnum;
  price_paid?: number;
  updated_at: string;
}

export interface ProductsInOrderType {
  id: string;
  quantity: number;
}

export enum OrderStatusEnum {
  PENDING = "pending",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrdersDatabaseType {
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

export const ErrorCodes = {
  "email-already-in-use":
    "The email address is already in use by another account.",
  "invalid-user-token": "Error with user details. Try logging in again.",
  "invalid-email": "The email address is not allowed",
  "unauthorized-domain": "Error with URL domain. Please, contact the admin.",
  "account-exists-with-different-credential":
    "This account already exists. Login using this account.",
  "network-request-failed":
    "A network error has occurred. Please, contact the admin.",
  "popup-blocked":
    "Unable to establish a connection with the popup. It may have been blocked by the browser.",
  "popup-closed-by-user":
    "The popup has been closed by the user before finalizing the operation.",
  "provider-already-linked": "User can only login by either Google or Email",
  "quota-exceeded": "Error with project requests. Please, contact the admin.",
  timeout: "The operation has timed out. Try again.",
  "user-token-expired":
    "Error with user token expiration. Try logging in again.",
  "too-many-requests": "You have too many requests. Try again later.",
  "user-not-found": "User does not exist. Sign up first.",
  "user-disabled": "The user account has been disabled by an administrator.",
  "Invalid document reference":
    "Issues with document access. Please, contact the admin",
};
