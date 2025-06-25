import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import copyFiles from '@thachnn/vite-plugin-copy';

const displayModules = () => ({
  name: 'display-modules',
  apply: 'build',
  enforce: 'pre',
  load: (id) => console.log('\r', id),
});

const transformCode = (...patterns) => ({
  name: 'transform-code',
  apply: 'build',
  enforce: 'post',
  transform(code, id, _ref) {
    return !code || !id || !(_ref = patterns.filter((p) => p.test.test(id))).length
      ? null
      : (this.info('code'), _ref.reduce((str, p) => str.replace(p.search, p.replace), code));
  },
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
  server: { port: 8000, open: false },
  plugins: [
    vue(),
    transformCode({
      test: /[\\/]OutputPanel\.vue$/,
      search: /\/node_modules\/highlight\.js\/\w+\/languages(\/[\w.-]+['"] ?:)/g,
      replace: '$1',
    }),
    displayModules(),
    copyFiles({ from: 'node_modules/prettier/{*.json,standalone.mjs,plugins/*.mjs}' }),
  ],
});
