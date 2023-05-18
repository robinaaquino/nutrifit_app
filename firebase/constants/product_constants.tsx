import { StaticImageData } from "next/image";

export const ProductCategoriesList = [
  "Digestive Health",
  "Enhancers",
  "Heart Health",
  "Personalized Weight Management",
  "Sports Nutrition",
  "Targeted Nutrition",
];

export type ProductsDatabaseType = {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity_left: number;
  images: any[];

  quantity_in_carts?: number;
  quantity_sold?: number;

  created_at?: string;
  updated_at?: string;
};

export type ProductsDatabaseTypeFromDB = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity_left: number;
  images: any[];

  quantity_in_carts: number;
  quantity_sold: number;

  created_at: string;
  updated_at: string;
};
