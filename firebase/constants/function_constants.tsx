import { ResultTypeEnum } from "./enum_constants";

export type FunctionResult =
  | {
      result: "";
      resultType: ResultTypeEnum.TEXT;
      isSuccess: Boolean;
      message: string;
    }
  | {
      result: any[];
      resultType: ResultTypeEnum.ARRAY;
      isSuccess: Boolean;
      message: string;
    }
  | {
      result: {};
      resultType: ResultTypeEnum.OBJECT;
      isSuccess: Boolean;
      message: string;
    }
  | {
      result: null;
      resultType: ResultTypeEnum.NULL;
      isSuccess: Boolean;
      message: string;
    }
  | {
      result: boolean;
      resultType: ResultTypeEnum.BOOLEAN;
      isSuccess: Boolean;
      message: string;
    };
