/**
 * @param {(number|string)} timeout
 * @param {...string} [fallbacks]
 * @returns {Promise<Record<string, *>>}
 */
export async function fetchManifest(timeout, ...fallbacks) {
  if (typeof timeout != 'number') {
    fallbacks.unshift(timeout);
    timeout = 1500;
  }

  let error;
  for (const url of fallbacks)
    try {
      const response = await fetchWithTimeout(
        `${url}`.replace(/\/+(?:package\.json)?$/i, '') + '/package.json',
        { timeout },
      );

      if (response.ok) {
        const manifest = await response.json();
        manifest._where = response.url;
        return manifest;
      }

      error = new Error('Response status: ' + response.status);
    } catch (e) {
      error = e;
    }

  throw error || new TypeError('Invalid arguments');
}

/** @returns {Promise<Response>} */
export async function fetchWithTimeout(url, options = {}) {
  const { timeout = 8000, ...opts } = options;

  const controller = new AbortController();
  opts.signal = controller.signal;

  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, opts);
  } finally {
    clearTimeout(timer);
  }
}

/** @returns {string} */
export function toKebabCase(val, prefix = '') {
  return prefix + `${val}`.replace(/[a-z0-9](?=[A-Z])|[A-Z](?=[A-Z][a-z])/g, '$&-').toLowerCase();
}
