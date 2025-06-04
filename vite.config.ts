import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/slimfont/',
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      'wasm-ttf2woff': path.resolve(__dirname, 'node_modules/wasm-ttf2woff/dist/browser/ttf2woff.min.js'),
    },
  },
});
