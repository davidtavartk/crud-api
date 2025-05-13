import { makeRequest, assertEqual, assertStatusCode, createTestUser } from './utils.js';

export const testCrudOperations = async () => {
  const initialResponse = await makeRequest('GET', '/api/users');
  assertStatusCode(
    initialResponse.statusCode,
    200,
    'Should return 200 status code for initial GET'
  );

  const initialUsers = initialResponse.body;
  console.log(`Initial users count: ${initialUsers.length}`);

  const testUser = createTestUser();
  const createResponse = await makeRequest('POST', '/api/users', testUser);
  assertStatusCode(
    createResponse.statusCode,
    201,
    'Should return 201 status code for user creation'
  );
  const createdUser = createResponse.body;

  assertEqual(
    createdUser.username,
    testUser.username,
    'Created user should have the correct username'
  );
  assertEqual(createdUser.age, testUser.age, 'Created user should have the correct age');
  assertEqual(
    createdUser.hobbies,
    testUser.hobbies,
    'Created user should have the correct hobbies'
  );
  console.log(`User created with ID: ${createdUser.id}`);

  const getResponse = await makeRequest('GET', `/api/users/${createdUser.id}`);
  assertStatusCode(
    getResponse.statusCode,
    200,
    'Should return 200 status code when getting the user'
  );
  assertEqual(getResponse.body, createdUser, 'Retrieved user should match the created user');

  const updatedData = {
    username: `${testUser.username}_updated`,
    age: testUser.age + 1,
    hobbies: [...testUser.hobbies, 'reading']
  };

  const updateResponse = await makeRequest('PUT', `/api/users/${createdUser.id}`, updatedData);
  assertStatusCode(
    updateResponse.statusCode,
    200,
    'Should return 200 status code when updating the user'
  );
  const updatedUser = updateResponse.body;

  assertEqual(updatedUser.id, createdUser.id, 'Updated user should have the same ID');
  assertEqual(
    updatedUser.username,
    updatedData.username,
    'Updated user should have the updated username'
  );
  assertEqual(updatedUser.age, updatedData.age, 'Updated user should have the updated age');
  assertEqual(
    updatedUser.hobbies,
    updatedData.hobbies,
    'Updated user should have the updated hobbies'
  );

  const deleteResponse = await makeRequest('DELETE', `/api/users/${createdUser.id}`);
  assertStatusCode(
    deleteResponse.statusCode,
    204,
    'Should return 204 status code when deleting the user'
  );

  const getDeletedResponse = await makeRequest('GET', `/api/users/${createdUser.id}`);
  assertStatusCode(
    getDeletedResponse.statusCode,
    404,
    'Should return 404 status code when trying to get a deleted user'
  );
};

export const testInvalidUserCreation = async () => {
  const invalidUser = {
    username: 'incomplete_user'
  };

  const response = await makeRequest('POST', '/api/users', invalidUser);
  assertStatusCode(response.statusCode, 400, 'Should return 400 status code for invalid user data');

  const invalidTypeUser = {
    username: 'invalid_types',
    age: 'not_a_number',
    hobbies: 'not_an_array'
  };

  const responseTypes = await makeRequest('POST', '/api/users', invalidTypeUser);
  assertStatusCode(
    responseTypes.statusCode,
    400,
    'Should return 400 status code for invalid data types'
  );
};

export const testInvalidUuid = async () => {
  const invalidUuid = 'not-a-valid-uuid';

  const getResponse = await makeRequest('GET', `/api/users/${invalidUuid}`);
  assertStatusCode(
    getResponse.statusCode,
    400,
    'Should return 400 status code for invalid UUID format on GET'
  );

  const updateResponse = await makeRequest('PUT', `/api/users/${invalidUuid}`, {
    username: 'test',
    age: 25,
    hobbies: []
  });
  assertStatusCode(
    updateResponse.statusCode,
    400,
    'Should return 400 status code for invalid UUID format on PUT'
  );

  const deleteResponse = await makeRequest('DELETE', `/api/users/${invalidUuid}`);
  assertStatusCode(
    deleteResponse.statusCode,
    400,
    'Should return 400 status code for invalid UUID format on DELETE'
  );
};
