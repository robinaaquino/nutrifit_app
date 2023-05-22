import { MessageStatusEnum } from "./enum_constants";

export type MessagesDatabaseType = {
  id?: string;
  name: string;
  email: string;
  message: string;
  reply?: string;
  status: MessageStatusEnum;

  created_at?: string;
  updated_at?: string;
};
