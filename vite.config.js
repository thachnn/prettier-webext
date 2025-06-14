import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const stats = () => ({
  name: 'display-modules',
  load: { order: 'pre', handler: (id) => console.log('\t', id) },
});

// https://vite.dev/config/
export default defineConfig({
  base: './',
  mode: 'production',
  esbuild: { minifyWhitespace: false, minifyIdentifiers: false },
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      //logLevel: 'debug',
      output: {
        generatedCode: 'es2015',
        interop: 'esModule',
        manualChunks: (id) => (/\bnode_modules[\\\/]/.test(id) ? 'vendor' : null),
      },
    },
    commonjsOptions: { sourceMap: false, esmExternals: true },
  },
  server: { port: 8080, open: false },
  plugins: [vue(), stats()],
});
