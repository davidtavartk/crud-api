export const validateUser = (user) => {
  const errors = [];

  if (!user.username || typeof user.username !== 'string') {
    errors.push('Username is required and must be a string');
  }

  if (user.age === undefined || typeof user.age !== 'number') {
    errors.push('Age is required and must be a number');
  }

  if (!Array.isArray(user.hobbies)) {
    errors.push('Hobbies must be an array');
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
