import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/login': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false,
        },
        '/peers': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false,
        },
        '/peerjs': {
          target: 'http://localhost:9000',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
  