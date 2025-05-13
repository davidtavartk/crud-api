import { ValidationResult } from '../types.js';

interface UserData {
  username?: any;
  age?: any;
  hobbies?: any;
}

export const validateUser = (user: UserData): ValidationResult => {
  const errors: string[] = [];

  if (!user.username || typeof user.username !== 'string') {
    errors.push('Username is required and must be a string');
  }

  if (user.age === undefined || typeof user.age !== 'number') {
    errors.push('Age is required and must be a number');
  }

  if (!Array.isArray(user.hobbies)) {
    errors.push('Hobbies is required and must be an array');
  } else {
    const invalidHobbies = user.hobbies.filter((hobby) => typeof hobby !== 'string');
    if (invalidHobbies.length > 0) {
      errors.push('All hobbies must be strings');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
