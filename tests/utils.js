import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { PORT } from './helpers.js';

export const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const statusCode = res.statusCode;
        let responseBody;

        try {
          const bodyBuffer = Buffer.concat(chunks);
          responseBody = bodyBuffer.length > 0 ? JSON.parse(bodyBuffer.toString()) : null;
        } catch (error) {
          responseBody = null;
        }

        resolve({ statusCode, body: responseBody });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
};

export const assertEqual = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`FAIL: ${message}`);
    console.error(`Expected: ${JSON.stringify(expected)}`);
    console.error(`Actual: ${JSON.stringify(actual)}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`PASS: ${message}`);
};

export const assertStatusCode = (statusCode, expected, message) => {
  if (statusCode !== expected) {
    console.error(`FAIL: ${message}`);
    console.error(`Expected status code: ${expected}`);
    console.error(`Actual status code: ${statusCode}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`PASS: ${message} (Status code: ${statusCode})`);
};

export const runTest = async (name, testFn) => {
  console.log(`\nRunning test: ${name}`);
  try {
    await testFn();
    console.log(`Test passed: ${name}\n`);
    return true;
  } catch (error) {
    console.error(`Test failed: ${name}`);
    console.error(error);
    console.error('\n');
    return false;
  }
};

export const createTestUser = () => ({
  username: `testuser_${randomUUID().slice(0, 8)}`,
  age: Math.floor(Math.random() * 50) + 18,
  hobbies: ['testing', 'coding']
});
