import http from 'http';
import httpProxy from 'http-proxy';
import chalk from 'chalk';

// Create a proxy to forward to FastAPI
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8000',
  changeOrigin: true,
});

// Server to handle requests
const server = http.createServer((req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  const url = req.url;
  const method = req.method;

  console.log(
    chalk.blue(`[${timestamp}]`) +
      ` ${chalk.green(method)} request to ${chalk.yellow(url)}`
  );

  proxy.web(req, res, (err) => {
    console.error(chalk.red('Proxy error:'), err.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  res.on('finish', () => {
    console.log(chalk.gray(`→ Response sent with status ${res.statusCode}\n`));
  });
});

server.listen(3001, () => {
  console.log(chalk.magenta('🚀 Dev proxy running at http://localhost:3001'));
  console.log(chalk.cyan('🌐 Forwarding requests to http://localhost:8000'));
});
