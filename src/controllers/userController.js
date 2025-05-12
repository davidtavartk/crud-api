import { userService } from '../services/userService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { validateUUID } from '../utils/validateUUID.js';

export const userController = {
  getAllUsers: (req, res) => {
    const users = userService.getAllUsers();
    sendResponse(res, 200, users);
  },

  getUserById: (req, res) => {
    const { userId } = req.params;

    if (!validateUUID(userId)) {
      return sendResponse(res, 400, { message: 'User ID is invalid. Must be a valid UUID.' });
    }

    const user = userService.getUserById(userId);

    if (!user) {
      return sendResponse(res, 404, { message: `User with ID ${userId} not found.` });
    }

    sendResponse(res, 200, user);
  }
};
