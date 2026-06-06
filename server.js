const { createServer } = require('http');
const { readFileSync, existsSync } = require('fs');
const { join, extname } = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

createServer((req, res) => {
  let filePath = join(ROOT, req.url === '/' ? 'index.html' : req.url);
  if (!existsSync(filePath)) filePath = join(ROOT, 'index.html');
  
  const ext = extname(filePath);
  const content = readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
  res.end(content);
}).listen(PORT, () => console.log(`AstroVision rodando na porta ${PORT}`));