const { spawn } = require('child_process');
const { join } = require('path');

// Config
const PORT = 4000;

// Start the server
const startServer = () => {
  return new Promise((resolve, reject) => {
    console.log('Starting TypeScript server...');
    
    const server = spawn('node', ['--loader', 'ts-node/esm', join(__dirname, '../src/server.ts')], {
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

const runTests = async () => {
  try {
    // Start the server
    const server = await startServer();
    
    // Run the tests
    console.log('Running tests...');
    const testProcess = spawn('node', [join(__dirname, 'run-tests.js')], {
      stdio: 'inherit',
      env: { ...process.env, PORT }
    });
    
    // Wait for tests to complete
    await new Promise((resolve, reject) => {
      testProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Tests failed with code ${code}`));
        }
      });
    });
    
    // Stop the server
    console.log('Tests completed. Stopping server...');
    server.kill();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

runTests();