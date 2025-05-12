import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../db.json');

const initialData = [
  {
    id: '5e9f9a8b-bd16-4562-b661-6e1e471bb8a0',
    username: 'johndoe',
    age: 25,
    hobbies: ['reading', 'swimming']
  }
];

const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData), 'utf8');
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return initialData;
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data), 'utf8');
  } catch (error) {
    // Silent fail
  }
};

export const usersDb = {
  getAll: () => {
    const users = readDb();
    return [...users];
  },

  getById: (id) => {
    const users = readDb();
    const user = users.find((user) => user.id === id);
    return user ? { ...user } : null;
  },

  create: (user) => {
    const users = readDb();
    users.push(user);
    writeDb(users);
    return { ...user };
  },

  update: (id, updatedUser) => {
    const users = readDb();
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = updatedUser;
      writeDb(users);
      return { ...updatedUser };
    }
    return null;
  },

  delete: (id) => {
    const users = readDb();
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      writeDb(users);
      return true;
    }
    return false;
  }
};
