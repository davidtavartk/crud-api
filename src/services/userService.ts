import { usersDb } from '../models/usersDb.js';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types.js';

interface UserData {
  username: string;
  age: number;
  hobbies?: string[];
}

export const userService = {
  getAllUsers: (): User[] => {
    return usersDb.getAll();
  },
  
  getUserById: (userId: string): User | null => {
    return usersDb.getById(userId);
  },
  
  createUser: (userData: UserData): User => {
    const newUser: User = {
      id: uuidv4(),
      username: userData.username,
      age: userData.age,
      hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : []
    };
    
    return usersDb.create(newUser);
  },
  
  updateUser: (userId: string, userData: UserData): User | null => {
    const updatedUser: User = {
      id: userId,
      username: userData.username,
      age: userData.age,
      hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : []
    };
    
    return usersDb.update(userId, updatedUser);
  },
  
  deleteUser: (userId: string): boolean => {
    return usersDb.delete(userId);
  }
};