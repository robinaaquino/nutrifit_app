import { StaticImageData } from "next/image";

export type ProductsInCartsType = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  image?: string | StaticImageData;
};

export type CartsDatabaseType = {
  id?: string;
  created_at?: string;
  updated_at?: string;

  products: ProductsInCartsType[];
  subtotal_price: number;
  user_id: string;
};
