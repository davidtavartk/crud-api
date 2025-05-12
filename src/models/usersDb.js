const users = [
  // Sample user for testing
  {
    id: '5e9f9a8b-bd16-4562-b661-6e1e471bb8a0',
    username: 'johndoe',
    age: 25,
    hobbies: ['reading', 'swimming']
  }
];

export const usersDb = {
  getAll: () => {
    return [...users];
  },

  getById: (id) => {
    const user = users.find((user) => user.id === id);
    return user ? { ...user } : null;
  },

  create: (user) => {
    users.push(user);
    return { ...user };
  },

  update: (id, updatedUser) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = updatedUser;
      return { ...updatedUser };
    }
    return null;
  },

  delete: (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }
};
