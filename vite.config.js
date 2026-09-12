import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 1717,
    host: true,
    watch: {
      usePolling: true,
      interval: 300
    }
  }
});
