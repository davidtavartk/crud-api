// src/app.js
import { routes } from './routes/index.js';
import { parseUrl } from './utils/parseUrl.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const requestHandler = async (req, res) => {
  try {
    const parsedUrl = parseUrl(req);

    // Add the body parser middleware
    if (['POST', 'PUT'].includes(req.method)) {
      await parseBody(req);
    }

    const route = routes.find((r) => r.method === req.method && r.path.test(parsedUrl.pathname));

    if (route) {
      // Extract route params if any
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

    // Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Resource not found' }));
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
