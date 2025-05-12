import { runTest } from './utils.js';
import { testCrudOperations, testInvalidUserCreation, testInvalidUuid } from './scenarios.js';
import { spawn } from 'node:child_process';
import { config } from '../src/config.js';

const PORT = config.PORT || 4000;

const startServer = () => {
  console.log('Starting server process...');
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['src/server.js'], {
      env: { ...process.env, PORT },
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
  console.log('Starting tests...');

  console.log(`Starting server on port ${PORT}...`);
  let server;
  try {
    server = await startServer();
    console.log('Server started, proceeding with tests...');

    let passedTests = 0;
    let totalTests = 0;

    const tests = [
      { name: 'CRUD Operations Test', fn: testCrudOperations },
      { name: 'Invalid User Creation Test', fn: testInvalidUserCreation },
      { name: 'Invalid UUID Handling Test', fn: testInvalidUuid }
    ];

    totalTests = tests.length;

    for (const test of tests) {
      const passed = await runTest(test.name, test.fn);
      if (passed) passedTests++;
    }

    console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);
  } catch (error) {
    console.error('Error during test execution:', error);
    process.exit(1);
  } finally {
    if (server) {
      console.log('Shutting down server...');
      server.kill();
    }
  }
};

console.log('Test script started');
runTests().catch((error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});
