import { routes } from './routes/index.js';
import { parseUrl } from './utils/parseUrl.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sendResponse } from './utils/sendResponse.js';

export const requestHandler = async (req, res) => {
  try {
    const parsedUrl = parseUrl(req);

    if (['POST', 'PUT'].includes(req.method)) {
      await parseBody(req);
    }

    const route = routes.find((r) => r.method === req.method && r.path.test(parsedUrl.pathname));

    if (route) {
      if (route.path.exec(parsedUrl.pathname)) {
        req.params = {};
        const matches = route.path.exec(parsedUrl.pathname);
        if (matches && route.paramNames) {
          route.paramNames.forEach((name, i) => {
            req.params[name] = matches[i + 1];
          });
        }
      }

      return route.handler(req, res);
    }

    const requestedPath = parsedUrl.pathname;
    sendResponse(res, 404, {
      message: `Resource not found: The requested endpoint '${requestedPath}' does not exist.`,
      suggestion: 'Please check the API documentation for available endpoints.'
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    const bodyParts = [];

    req.on('data', (chunk) => {
      bodyParts.push(chunk);
    });

    req.on('end', () => {
      if (bodyParts.length) {
        const bodyString = Buffer.concat(bodyParts).toString();
        try {
          req.body = JSON.parse(bodyString);
        } catch (e) {
          req.body = {};
        }
      } else {
        req.body = {};
      }
      resolve();
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
};
