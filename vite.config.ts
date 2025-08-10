import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/announcements': {
        target: `${process.env.VITE_SUPABASE_URL}/functions/v1/public-announcements`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/announcements/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`);
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
