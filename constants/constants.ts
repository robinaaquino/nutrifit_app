export const NOTIFICATION_STATES = {
  SUCCESS: "success",
  ERROR: "error",
};

export interface functionResult {
  result: any;
  isSuccess: Boolean;
  resultText: string;
  errorMessage: string;
}
