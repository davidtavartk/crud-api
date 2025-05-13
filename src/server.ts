import http from 'node:http';
import { config } from './config.js';
import { requestHandler } from './app.js';

const PORT = config.PORT || 4000;
const NODE_ENV = config.NODE_ENV || 'development';

export const startServer = (port: number = Number(PORT)): http.Server => {
  const server = http.createServer(requestHandler);

  server.listen(port, () => {
    console.log(`Server is running on port ${port} in ${NODE_ENV} mode`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      process.exit(1);
    }
  });

  return server;
};

if (!process.env.WORKER_PORT && process.env.NODE_ENV !== 'test') {
  startServer();
}