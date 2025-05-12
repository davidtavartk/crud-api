// src/server.js
import http from 'http';
import { config } from './config.js';
import { requestHandler } from './app.js';

const PORT = config.PORT || 4000;

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.NODE_ENV} mode`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
