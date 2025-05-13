import { IncomingMessage, ServerResponse } from 'node:http';
import { userService } from '../services/userService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { validateUUID } from '../utils/validateUUID.js';
import { validateUser } from '../utils/validateUser.js';

interface ExtendedIncomingMessage extends IncomingMessage {
  params?: Record<string, string>;
  body?: any;
}

export const userController = {
  getAllUsers: (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const users = userService.getAllUsers();
    sendResponse(res, 200, users);
  },

  getUserById: (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const userId = req.params?.userId;

    if (!userId || !validateUUID(userId)) {
      return sendResponse(res, 400, { message: 'User ID is invalid. Must be a valid UUID.' });
    }

    const user = userService.getUserById(userId);

    if (!user) {
      return sendResponse(res, 404, { message: `User with ID ${userId} not found.` });
    }

    sendResponse(res, 200, user);
  },

  createUser: (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const validation = validateUser(req.body || {});

    if (!validation.valid) {
      return sendResponse(res, 400, {
        message: 'Invalid user data',
        errors: validation.errors
      });
    }

    const newUser = userService.createUser(req.body);
    sendResponse(res, 201, newUser);
  },

  updateUser: (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const userId = req.params?.userId;

    if (!userId || !validateUUID(userId)) {
      return sendResponse(res, 400, { message: 'User ID is invalid. Must be a valid UUID.' });
    }

    const existingUser = userService.getUserById(userId);

    if (!existingUser) {
      return sendResponse(res, 404, { message: `User with ID ${userId} not found.` });
    }

    const validation = validateUser(req.body || {});

    if (!validation.valid) {
      return sendResponse(res, 400, {
        message: 'Invalid user data',
        errors: validation.errors
      });
    }

    const updatedUser = userService.updateUser(userId, req.body);
    sendResponse(res, 200, updatedUser);
  },

  deleteUser: (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const userId = req.params?.userId;

    if (!userId || !validateUUID(userId)) {
      return sendResponse(res, 400, { message: 'User ID is invalid. Must be a valid UUID.' });
    }

    const existingUser = userService.getUserById(userId);

    if (!existingUser) {
      return sendResponse(res, 404, { message: `User with ID ${userId} not found.` });
    }

    userService.deleteUser(userId);

    res.writeHead(204);
    res.end();
  }
};
