import http from 'node:http';
import { config } from './config.js';
import { requestHandler } from './app.js';

const PORT = config.PORT || 4000;
const NODE_ENV = config.NODE_ENV || 'development';

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);

  // Additional logging in development mode
  if (NODE_ENV === 'development') {
    console.log(
      'Development mode: Nodemon will automatically restart the server when files change'
    );
  } else {
    console.log('Production mode: Running optimized build');
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
