import { ServerResponse } from 'node:http';

export const sendResponse = (res: ServerResponse, statusCode: number, data: any): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};