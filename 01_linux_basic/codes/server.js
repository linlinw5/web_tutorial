import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello World!</h1>');
  res.end();
});

// 启动 HTTP 服务器，监听 3000 端口
server.listen(3000, () => {
  console.log('Server listening on port 3000...');
});
