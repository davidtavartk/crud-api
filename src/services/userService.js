import { usersDb } from '../models/usersDb.js';

export const userService = {
  getAllUsers: () => {
    return usersDb.getAll();
  }
};
