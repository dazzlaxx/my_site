const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World! Node.js работает!\n');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Node.js версия: ${process.version}`);
});