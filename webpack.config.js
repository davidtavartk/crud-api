import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  target: 'node',
  entry: './src/server.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    module: true,
    libraryTarget: 'module',
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  },
  externalsType: 'module',
  externals: [nodeExternals({ importType: 'module' })],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  }
};