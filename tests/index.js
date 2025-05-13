import { runTest } from './utils.js';
import { testCrudOperations, testInvalidUserCreation, testInvalidUuid } from './scenarios.js';
import { startServer, PORT } from './helpers.js';

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
