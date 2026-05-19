import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    strictPort: true,
    proxy: {
      '/api/catalog': 'http://localhost:3001',
      '/api/orders':  'http://localhost:3002',
    },
  },
});
