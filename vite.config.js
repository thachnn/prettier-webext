import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
//
import { copyFile, mkdir } from 'fs/promises';
import { basename, dirname, join, resolve } from 'path';
import { glob } from 'tinyglobby';

const copyFiles = (patterns, opts = {}) => ({
  name: 'copy-files',
  apply: 'build',
  configResolved(config) {
    opts.root ||= config.root || process.cwd();
    opts.outDir ||= config.build?.outDir;
  },
  async closeBundle() {
    for (const { from, to } of [].concat(patterns)) {
      const sources = await glob(from, { cwd: opts.root });

      const dest = resolve(opts.root, opts.outDir, to);
      const isFile = sources.length === 1 && to[to.length - 1] !== '/' && dirname(dest);

      try {
        await mkdir(isFile || dest, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST' && err.code !== 'EROFS') throw err;
      }
      isFile
        ? await copyFile(sources[0], dest)
        : await Promise.all(sources.map((src) => copyFile(src, join(dest, basename(src)))));
    }
  },
});

const displayModules = () => ({
  name: 'display-modules',
  apply: 'build',
  enforce: 'pre',
  load: (id) => console.log('\r', id),
});

// https://vite.dev/config/
export default defineConfig({
  base: '',
  mode: 'production',
  esbuild: { minifyWhitespace: false, minifyIdentifiers: false },
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: { generatedCode: 'es2015', interop: 'esModule' },
    },
    commonjsOptions: { sourceMap: false, esmExternals: true },
  },
  server: { port: 8080, open: false },
  plugins: [
    splitVendorChunkPlugin(),
    vue(),
    displayModules(),
    copyFiles([
      { from: 'node_modules/prettier/{*.json,standalone.mjs}', to: 'node_modules/prettier' },
      { from: 'node_modules/prettier/plugins/*.mjs', to: 'node_modules/prettier/plugins' },
    ]),
  ],
});
