import { RoleEnum } from "./enum_constants";

export type ShippingDetailsType = {
  address: string;
  first_name: string;
  last_name: string;
  city: string;
  province: string;
  contact_number: string;
};

export interface UsersDatabaseType {
  id: string;
  email: string;

  contact_number?: string;
  created_at?: string;
  updated_at?: string;
  role?: RoleEnum;
  shipping_details?: ShippingDetailsType;
  image?: string | File;
}
