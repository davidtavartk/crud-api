import { IncomingMessage, ServerResponse } from 'node:http';
import { sendResponse } from '../utils/sendResponse.js';

export const errorHandler = (err: Error, req: IncomingMessage, res: ServerResponse): void => {
  sendResponse(res, 500, { 
    message: 'Internal server error occurred while processing your request.',
    suggestion: 'Please try again later or contact the API administrator if the problem persists.'
  });
};

export default errorHandler;