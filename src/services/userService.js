import { usersDb } from '../models/usersDb.js';
import { v4 as uuidv4 } from 'uuid';

export const userService = {
  getAllUsers: () => {
    return usersDb.getAll();
  },

  getUserById: (userId) => {
    return usersDb.getById(userId);
  },

  createUser: (userData) => {
    const newUser = {
      id: uuidv4(),
      username: userData.username,
      age: userData.age,
      hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : []
    };

    return usersDb.create(newUser);
  },

  updateUser: (userId, userData) => {
    const updatedUser = {
      id: userId,
      username: userData.username,
      age: userData.age,
      hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : []
    };

    return usersDb.update(userId, updatedUser);
  },

  deleteUser: (userId) => {
    return usersDb.delete(userId);
  }
};
