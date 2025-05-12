import { sendResponse } from '../utils/sendResponse.js';

export const errorHandler = (err, req, res) => {
  console.error('Server error:', err);
  sendResponse(res, 500, { message: 'Internal server error' });
};
