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
  },
  {
    method: 'POST',
    path: /^\/api\/users$/,
    handler: userController.createUser
  },
  {
    method: 'PUT',
    path: /^\/api\/users\/([^/]+)$/,
    paramNames: ['userId'],
    handler: userController.updateUser
  },
  {
    method: 'DELETE',
    path: /^\/api\/users\/([^/]+)$/,
    paramNames: ['userId'],
    handler: userController.deleteUser
  }
];

export default userRoutes;
