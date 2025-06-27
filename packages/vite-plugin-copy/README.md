# @thachnn/vite-plugin-copy

A powerful [Vite](https://vite.dev) / [rollup](https://rollupjs.org) plugin for copying files, which already exist, during build with advanced transformation and renaming capabilities.

> This is similar to the [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin).
> [tinyglobby](https://www.npmjs.com/package/tinyglobby) is used just like `Vite`, so, globs accept [picomatch pattern-syntax](https://www.npmjs.com/package/picomatch#globbing-features).

## Installation

```bash
npm install @thachnn/vite-plugin-copy --save-dev
```

or

```bash
yarn add -D @thachnn/vite-plugin-copy
```

## Usage

Add this plugin to your `vite` / `rollup` config. For example:

```js
import copyFiles from '@thachnn/vite-plugin-copy';

export default {
  plugins: [
    copyFiles(
      [
        // Copy all .md files from 'node_modules/vite' to 'dist/', flatten
        { from: 'node_modules/vite/**/*.md', to: (fn) => fn.replace(/^.*[\\/]/, '') },
        // Copy/rename LICENSE.md file from 'node_modules/vite' to 'dist/LICENSE', and modify the content
        {
          from: 'node_modules/vite/LICENSE.*',
          to: 'LICENSE',
          transform: (buf) => `${buf}`.replace('(c)', '©'),
        },
        // Copy all .d.ts files from 'node_modules/vite' to 'types/', but keep directory structure
        { from: '**/*.d.ts', context: 'node_modules/vite', to: '../types/' },
      ],
      { outDir: 'dist' },
    ),
  ],
};
```
