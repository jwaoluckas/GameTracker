/**
 * GameTracker — servidor estático opcional (Node.js puro, sem dependências).
 * O site não precisa de backend nem de banco de dados: todo o CRUD roda no
 * navegador (localStorage). Este servidor só existe para facilitar rodar o
 * projeto em http://localhost em vez de abrir o index.html via file://.
 *
 * Uso: node server.js  (depois acesse http://localhost:3000)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));

  // Evita path traversal para fora da raiz do projeto.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Acesso negado.');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': MIME['.html'] });
        res.end('<h1>404</h1><p>Página não encontrada.</p>');
        return;
      }
      res.writeHead(500);
      res.end('Erro interno.');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`GameTracker rodando em http://localhost:${PORT}`);
});
