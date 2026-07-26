import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'Gateway', dir: 'backend/gateway', command: 'node', args: ['index.js'], port: null },
  { name: 'Auth', dir: 'backend/services/auth', command: 'node', args: ['index.js'], port: 8001 },
  { name: 'Chat', dir: 'backend/services/chat', command: 'node', args: ['index.js'], port: 8002 },
  { name: 'Agent', dir: 'backend/services/agent', command: 'node', args: ['index.js'], port: 8003 }
];

const children = [];

console.log('Starting all CortexAI Backend services in Production mode...');

services.forEach((service) => {
  const serviceDir = path.resolve(__dirname, service.dir);
  
  const servicePort = service.port || process.env.PORT || 8000;
  console.log(`Launching ${service.name} (port ${servicePort}) in ${serviceDir}...`);
  
  const child = spawn(service.command, service.args, {
    cwd: serviceDir,
    shell: true,
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      PORT: servicePort
    }
  });
  
  children.push({ name: service.name, process: child });
  
  child.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data.toString().trim()}`);
  });
  
  child.stderr.on('data', (data) => {
    console.error(`[${service.name} ERR] ${data.toString().trim()}`);
  });
  
  child.on('close', (code) => {
    console.log(`[${service.name}] process exited with code ${code}`);
    cleanup();
  });
});

let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  console.log('\nShutting down all backend services...');
  children.forEach(child => {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', child.process.pid, '/f', '/t']);
      } else {
        child.process.kill();
      }
    } catch (e) {
      // Ignore
    }
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in runner:', err);
  cleanup();
});
