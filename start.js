const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('  STARTING CAMPUS LOST & FOUND MANAGEMENT SYSTEM (CampusFind)   ');
console.log('  NMIMS MPSTME - Software Engineering Experiments 1-10         ');
console.log('================================================================');

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

// Start Server
console.log('[Runner] Starting Backend Server (Port 5000)...');
const serverProcess = spawn('node', ['--import', 'tsx', 'src/index.ts'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
});

// Start Client
console.log('[Runner] Starting Frontend Vite Dev Server (Port 5173)...');
const clientProcess = spawn('node', ['./node_modules/vite/bin/vite.js'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n[Runner] Shutting down CampusFind processes...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
