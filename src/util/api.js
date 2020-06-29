const dbServer = '//localhost:3001';

export async function doFetch(route, opts = {}) {
  const response = await fetch(`${dbServer}${route}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...opts
  });
  const body = await response.json();
  if (response.status >= 400) {
    throw body;
  }
  return body;
}
