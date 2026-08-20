import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

export const Config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  ENV: process.env.NODE_ENV || 'production',
  DB_PATH: process.env.DB_PATH || path.join(ROOT_DIR, 'data', 'techon_production.sqlite'),
  CONTRACTOR_SHARE_MIN: 0.10, // 10%
  CONTRACTOR_SHARE_MAX: 0.15, // 15%
  JWT_SECRET: process.env.JWT_SECRET || 'techon_secret_production_key_2026',
  ROOT_DIR,
  PUBLIC_DIR: path.join(ROOT_DIR, 'src', 'public')
};
