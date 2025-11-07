import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // use relative assets so the site works regardless of path casing
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
});
