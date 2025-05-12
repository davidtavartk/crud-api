import { userService } from '../services/userService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const userController = {
  getAllUsers: (req, res) => {
    const users = userService.getAllUsers();
    sendResponse(res, 200, users);
  }
};
