import { spawn } from 'node:child_process';

// Default port for testing
export const PORT = 4000;

// Simple config instead of importing from TS files
export const config = {
  PORT: 4000,
  NODE_ENV: 'test'
};

export const startServer = () => {
  console.log('Starting server process...');
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['--loader', 'ts-node/esm', 'src/server.ts'], {
      env: { ...process.env, PORT, NODE_ENV: 'test' },
      stdio: 'pipe'
    });

    let started = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Server: ${output.trim()}`);
      if (output.includes(`Server is running on port ${PORT}`)) {
        console.log('Server started successfully!');
        started = true;
        setTimeout(() => resolve(server), 1000);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
      if (!started) {
        reject(new Error(`Server failed to start: ${data}`));
      }
    });

    setTimeout(() => {
      if (!started) {
        console.log('Server startup timeout - proceeding anyway...');
        resolve(server);
      }
    }, 5000);
  });
};
