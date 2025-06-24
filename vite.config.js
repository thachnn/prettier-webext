import { defineConfig } from 'vite';
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
  esbuild: { pure: ['console.log'] },
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        generatedCode: 'es2015',
        interop: 'esModule',
        manualChunks: (id) => ((id = /\bnode_modules[\\/]@?([\w-]+)/.exec(id)) ? id[1] : null),
      },
    },
    commonjsOptions: { sourceMap: false, esmExternals: true },
  },
  server: { port: 8080, open: false },
  plugins: [
    vue(),
    displayModules(),
    copyFiles({ from: 'node_modules/prettier/{*.json,standalone.mjs,plugins/*.mjs}' }),
  ],
});
