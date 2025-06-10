const { spawn } = require('child_process');
const http = require('http');

const PORT = 3001;
const server = spawn('node', ['server.js'], { env: { ...process.env, PORT } });

let done = false;

function finish(code) {
  if (!done) {
    done = true;
    server.kill();
    process.exit(code);
  }
}

server.stdout.on('data', data => {
  const msg = data.toString();
  if (msg.includes('Server running')) {
    http.get(`http://localhost:${PORT}`, res => {
      if (res.statusCode === 200) {
        console.log('Server responded with 200 OK');
        finish(0);
      } else {
        console.error(`Expected 200 OK, got ${res.statusCode}`);
        finish(1);
      }
    }).on('error', err => {
      console.error('HTTP request failed:', err);
      finish(1);
    });
  }
});

server.stderr.on('data', data => {
  console.error(data.toString());
});

setTimeout(() => {
  if (!done) {
    console.error('Test timed out');
    finish(1);
  }
}, 5000);
