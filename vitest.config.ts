import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['labs/**/tests/**/*.test.ts', 'assignments/**/tests/**/*.test.ts'],
    typecheck: {
      enabled: false, // turned on by `npm run test:types` / the grader
      include: ['labs/**/tests/**/*.test-d.ts', 'assignments/**/tests/**/*.test-d.ts'],
      tsconfig: 'tsconfig.json',
    },
  },
});
