import { fetchManifest, toKebabCase } from './utils.js';

/**
 * @typedef {(import('prettier')|{plugins: import('prettier').Plugin[]})} prettier
 * @param {Record<string, *>} manifest
 * @return {Promise<prettier>}
 */
export async function importPrettier(manifest) {
  const paths = new Set([manifest.browser.replace(/\.js$/i, '.mjs')]);

  for (const [key, val] of Object.entries(manifest.exports))
    typeof val == 'object' && /^(\.\/)?plugins\b/.test(key) && paths.add(val.default);
  // DEBUG
  console.info('Import prettier from:', paths);

  const [instance, ...plugins] = await Promise.all(
    [...paths].map((path) => import(new URL(path, manifest._where)).then((mod) => mod.default)),
  );

  instance.plugins = plugins;
  // DEBUG
  console.log('Imported prettier:', instance);
  return instance;
}

/**
 * @typedef {(prettier.SupportOption|{parsers: Object, cliName: string})} OptDefinition
 * @param {prettier} instance
 * @param {string[]} [excludes]
 * @param {Object.<string, Object>} [orders]
 * @return {Promise<Object.<string, OptDefinition[]>>}
 */
export async function buildOptionDefs(
  instance,
  excludes = ['plugins', 'filepath', 'endOfLine'],
  orders = {
    cat: { Global: -1, HTML: 1, Special: 2 },
    name: {
      embeddedLanguageFormatting: 1,
      singleQuote: -1,
      bracketSameLine: 1,
      semi: -3,
      jsxSingleQuote: -2,
      jsxBracketSameLine: -1,
      experimentalTernaries: 1,
      experimentalOperatorPosition: 2,
      rangeStart: 1,
      rangeEnd: 2,
      cursorOffset: 3,
    },
  },
) {
  const info = await instance.getSupportInfo();
  /** @type {OptDefinition[]} */
  const descriptors = info.options.filter((opt) => excludes.indexOf(opt.name) < 0);

  for (const plugin of instance.plugins)
    if (plugin.options) {
      const parsers = ['markdown', 'mdx']
        .concat(...plugin.languages.map((lang) => lang.parsers))
        .reduce((obj, k) => ((obj[k] = true), obj), {});

      for (const [key, descriptor] of Object.entries(plugin.options)) {
        const existent = descriptors.find((desc) => desc.name === key);
        existent
          ? existent.parsers && Object.assign(existent.parsers, parsers)
          : descriptors.push({ name: key, ...descriptor, parsers });
      }
    }

  descriptors.forEach(augmentDescriptor);

  return groupByCategory(descriptors, orders);
}

/** @param {OptDefinition} option */
function augmentDescriptor(option) {
  if (option.type === 'int' && !isFinite(option.default)) option.default = undefined;

  if (option.oppositeDescription && (option.type !== 'boolean' || !option.default))
    delete option.oppositeDescription;

  option.cliName = toKebabCase(option.name, !option.oppositeDescription ? '--' : '--no-');

  return option;
}

/**
 * @param {OptDefinition[]} descriptors
 * @param {Object.<string, Object>} orders
 * @return {Object.<string, OptDefinition[]>}
 */
function groupByCategory(descriptors, orders) {
  descriptors.sort(
    (a, b) =>
      (orders.cat[a.category] || 0) - (orders.cat[b.category] || 0) ||
      a.category.localeCompare(b.category) ||
      (orders.name[a.name] || 0) - (orders.name[b.name] || 0) ||
      a.name.localeCompare(b.name),
  );

  return descriptors.reduce((obj, d) => {
    return (obj[d.category] || (obj[d.category] = [])).push(d), obj;
  }, {});
}

/** @param {string} parser */
export function getParserLang(parser) {
  switch (parser) {
    case 'acorn':
    case 'babel':
    case 'espree':
    case 'meriyah':
      return 'javascript';

    case 'flow':
    case 'babel-flow':
    case 'babel-ts':
      return 'typescript';

    case 'angular':
    case 'lwc':
    case 'mjml':
    case 'vue':
      return 'html';

    case 'json5':
    case 'json-stringify':
      return 'json';

    case 'mdx':
      return 'markdown';
    case 'glimmer':
      return 'handlebars';

    default:
      return parser;
  }
}
