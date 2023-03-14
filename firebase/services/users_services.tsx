import { getAllUsersFunction } from '../firebase_functions/users_function';

export const getAllUsers = async() => {
  return await getAllUsersFunction();
}