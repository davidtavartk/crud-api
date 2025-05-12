import { userController } from '../controllers/userController.js';

export const userRoutes = [
  {
    method: 'GET',
    path: /^\/api\/users$/,
    handler: userController.getAllUsers
  },
  {
    method: 'GET',
    path: /^\/api\/users\/([^/]+)$/,
    paramNames: ['userId'],
    handler: userController.getUserById
  }
];

export default userRoutes;
