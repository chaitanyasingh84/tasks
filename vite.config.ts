import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/tasks/', // 👈 this line is the key for GitHub Pages!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
