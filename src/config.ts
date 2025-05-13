import { config as dotenvConfig } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenvConfig({ path: path.resolve(__dirname, '../', envFile) });
dotenvConfig({ path: path.resolve(__dirname, '../.env') });

export const config = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

console.log(`Application running in ${config.NODE_ENV} mode on port ${config.PORT}`);
