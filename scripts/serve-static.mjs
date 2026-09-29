import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};
createServer(async (req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, 'http://localhost').pathname,
  );
  if (pathname === '/mp2') {
    res.writeHead(302, { Location: '/mp2/' }).end();
    return;
  }
  const relative = pathname.startsWith('/mp2/')
    ? pathname.slice(5)
    : '__missing__';
  const file = resolve(root, relative || 'index.html');
  try {
    if (!file.startsWith(root + sep)) throw new Error('Outside root');
    const body = await readFile(file);
    res
      .writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
      })
      .end(body);
  } catch {
    res
      .writeHead(404, { 'Content-Type': 'text/html' })
      .end(await readFile(resolve(root, '404.html')));
  }
}).listen(4173, '127.0.0.1', () =>
  console.log('Pantry static preview: http://127.0.0.1:4173/mp2/'),
);
