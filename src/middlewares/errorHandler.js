import { sendResponse } from '../utils/sendResponse.js';

export const errorHandler = (err, req, res) => {
  console.error('Server error:', err);

  sendResponse(res, 500, {
    message: 'Internal server error occurred while processing your request.',
    suggestion: 'Please try again later or contact the API administrator if the problem persists.'
  });
};
