import { userController } from '../controllers/userController.js';

export const userRoutes = [
  {
    method: 'GET',
    path: /^\/api\/users$/,
    handler: userController.getAllUsers
  }
  
];

export default userRoutes;