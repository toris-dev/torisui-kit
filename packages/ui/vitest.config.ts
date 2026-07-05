import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // globals is required for @testing-library/react's automatic cleanup.
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
});
