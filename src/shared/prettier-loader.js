import { fetchManifest } from './utils.js';

/**
 * @typedef {import("prettier")} prettier
 * @param {Record<string, *>} manifest
 * @return {Promise<(prettier|{plugins: prettier.Plugin[]})>}
 */
export async function importPrettier(manifest) {
  const paths = new Set([manifest.browser.replace(/\.js$/i, '.mjs')]);

  for (const [key, val] of Object.entries(manifest.exports))
    typeof val == 'object' && /^(\.\/)?plugins\b/.test(key) && paths.add(val.default);

  const [prettier, ...plugins] = await Promise.all(
    [...paths].map((path) => import(new URL(path, manifest._where)).then((mod) => mod.default)),
  );

  prettier.plugins = plugins;
  return prettier;
}

//buildOptDefinitions
