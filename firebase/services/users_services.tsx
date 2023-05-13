import { getAllUsersFunction } from "../firebase_functions/users_functions";

export const getAllUsers = async () => {
  return await getAllUsersFunction();
};
