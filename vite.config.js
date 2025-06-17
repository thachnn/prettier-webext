import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import copyFiles from '@thachnn/vite-plugin-copy';

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
    copyFiles({ from: 'node_modules/prettier/{*.json,standalone.mjs,plugins/*.mjs}' }),
  ],
});
