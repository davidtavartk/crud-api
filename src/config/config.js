import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development'
};