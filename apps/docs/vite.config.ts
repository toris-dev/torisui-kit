import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// The playground consumes the library from source (not dist) so component
// changes hot-reload without a rebuild.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@toris-dev/ui',
        replacement: fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      },
    ],
  },
});
