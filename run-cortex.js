import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'Gateway ', dir: 'backend/gateway', command: 'npm', args: ['run', 'dev'] },
  { name: 'Auth    ', dir: 'backend/services/auth', command: 'npm', args: ['run', 'dev'] },
  { name: 'Chat    ', dir: 'backend/services/chat', command: 'npm', args: ['run', 'dev'] },
  { name: 'Agent   ', dir: 'backend/services/agent', command: 'npm', args: ['run', 'dev'] },
  { name: 'Frontend', dir: 'frontend', command: 'npm', args: ['run', 'dev'] }
];

const children = [];

console.log('Starting all CortexAI services...');

// Colors for console logging
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m'
};

const serviceColors = [colors.cyan, colors.green, colors.yellow, colors.magenta, colors.blue];

services.forEach((service, index) => {
  const serviceDir = path.resolve(__dirname, service.dir);
  const color = serviceColors[index % serviceColors.length];
  
  console.log(`Launching ${service.name} in ${serviceDir}...`);
  
  // Use shell: true for Windows environment compatibility with npm command
  const child = spawn(service.command, service.args, {
    cwd: serviceDir,
    shell: true
  });
  
  children.push({ name: service.name, process: child });
  
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${service.name}]${colors.reset} ${line}`);
      }
    });
  });
  
  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${color}[${service.name} ERR]${colors.reset} ${line}`);
      }
    });
  });
  
  child.on('close', (code) => {
    console.log(`${color}[${service.name}]${colors.reset} process exited with code ${code}`);
    cleanup();
  });
});

let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  console.log('\nShutting down all services...');
  children.forEach(child => {
    try {
      if (process.platform === 'win32') {
        // Under Windows, taskkill is used to clean process tree of the cmd/npm wrapper
        spawn('taskkill', ['/pid', child.process.pid, '/f', '/t']);
      } else {
        child.process.kill();
      }
    } catch (e) {
      // Ignore errors if process is already dead
    }
  });
  process.exit();
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in runner:', err);
  cleanup();
});
