import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    clean: true,
    dts: true,
    minify: true,
    sourcemap: true,
    target: 'node18',
    outDir: 'dist',
  },
  {
    entry: ['src/cli.ts'],
    format: ['esm', 'cjs'],
    clean: false,
    dts: false,
    minify: false,
    sourcemap: false,
    target: 'node18',
    outDir: 'dist',
    banner: {
      js: '#!/usr/bin/env node',
    },
    splitting: false,
  },
]);
