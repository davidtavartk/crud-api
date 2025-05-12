import http from 'http';
import { config } from './config.js';
import { requestHandler } from './app.js';

const PORT = config.PORT || 4000;

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});