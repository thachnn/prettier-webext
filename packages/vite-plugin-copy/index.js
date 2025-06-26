'use strict';

const { dirname, join, resolve, sep } = require('path');
const { copyFile, mkdir, readFile, writeFile } = require('fs').promises;
const { glob } = require('tinyglobby');

const transformFile = async ({ from, to, transform }) => {
  let content = await readFile(from);
  content = await transform(content, from);
  await writeFile(to, content);
};

/** @param {string} path */
const isDirPath = (path) => {
  const lastChar = path[path.length - 1];
  return lastChar === '/' || lastChar === sep;
};

const buildCopyList = async (patterns, { root, outDir, warn }) => {
  const entries = await Promise.all(
    patterns.map((copy) =>
      glob(copy.from, { cwd: (copy.context = resolve(root, copy.context || '')), absolute: false }),
    ),
  );
  outDir = join(root, outDir);
  const copyList = [];

  for (let sources, i = patterns.length - 1; i >= 0; i--) {
    if (!(sources = entries[i]) || !sources.length) {
      warn('No files found with: ' + patterns[i].from);
      continue;
    }

    const { to, context, transform } = patterns[i];
    if (!to)
      for (const src of sources) {
        copyList.push({ from: join(context, src), to: resolve(outDir, src), transform });
      }
    else if (typeof to == 'function') {
      const dest = await Promise.all(sources.map((src) => to(src)));
      for (let j = sources.length - 1; j >= 0; j--) {
        copyList.push({ from: join(context, sources[j]), to: resolve(outDir, dest[j]), transform });
      }
    } else if (sources.length > 1 || isDirPath(to))
      for (const src of sources) {
        copyList.push({ from: join(context, src), to: resolve(outDir, to, src), transform });
      }
    else copyList.push({ from: join(context, sources[0]), to: resolve(outDir, to), transform });
  }

  return copyList;
};

const tryMakeDir = async (dir) => {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

/** @returns {string[]} */
const collectOutDirs = (copyList, opts) => {
  const dirs = [...new Set(copyList.map(({ to }) => dirname(to)))];
  dirs.sort((a, b) => a.length - b.length || a.localeCompare(b));

  for (let n = dirs.length - 1, i = 0; i < n; i++)
    for (let dir = dirs[i] + sep, j = n; j > i; j--)
      if (dirs[j].startsWith(dir)) {
        dirs[i] = null;
        break;
      }

  opts.log(`Prepare ${dirs.length} directories...`);
  return dirs.filter(Boolean);
};

/** @returns {import('vite').Plugin} */
module.exports = (patterns, options = {}) => {
  const opts = { root: options.root || process.cwd(), outDir: options.outDir || '' };
  patterns = [].concat(patterns);

  return {
    name: options.name || 'vite-copy-files',
    apply: options.apply || 'build',
    configResolved(config) {
      if (config.root) opts.root = config.root;
      if (config.build && config.build.outDir) opts.outDir = config.build.outDir;
    },
    [options.hook || 'closeBundle']: async function (error) {
      if (error instanceof Error) return;

      opts.warn = this.warn ? this.warn.bind(this) : console.warn;
      opts.log = this.info ? this.info.bind(this) : console.log;

      const copyList = await buildCopyList(patterns, opts);
      // make directories first
      await Promise.all(collectOutDirs(copyList, opts).map((dir) => tryMakeDir(dir)));

      await Promise.all(
        copyList.map((op) => (op.transform ? transformFile(op) : copyFile(op.from, op.to))),
      );
      opts.log(copyList.length + ' files were copied.');
    },
  };
};
