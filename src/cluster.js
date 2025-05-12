import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { config } from './config.js';
import http from 'node:http';
import process from 'node:process';

const PORT = parseInt(config.PORT) || 4000;
const numCPUs = availableParallelism() - 1 || 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Setting up ${numCPUs} workers...`);

  const workers = [];
  for (let i = 0; i < numCPUs; i++) {
    const workerProcess = cluster.fork({ WORKER_PORT: PORT + i + 1 });
    workers.push(workerProcess);
    console.log(`Worker started on port ${PORT + i + 1}`);
  }

  let currentWorkerIndex = 0;

  const loadBalancer = http.createServer((req, res) => {
    const workerPort = PORT + currentWorkerIndex + 1;

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      res.writeHead(500);
      res.end('Internal Server Error', err);
    });

    // Update worker index after request is sent
    currentWorkerIndex = (currentWorkerIndex + 1) % numCPUs;
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    const index = workers.indexOf(worker);
    if (index > -1) {
      const newWorker = cluster.fork({ WORKER_PORT: PORT + index + 1 });
      workers[index] = newWorker;
      console.log(`New worker started on port ${PORT + index + 1}`);
    }
  });
} else {
  const WORKER_PORT = parseInt(process.env.WORKER_PORT);

  import('./server.js')
    .then((module) => {
      const { startServer } = module;
      startServer(WORKER_PORT);
    })
    .catch((err) => {
      console.error('Failed to import server module:', err);
      process.exit(1);
    });
}
