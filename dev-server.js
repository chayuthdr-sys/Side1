const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/lead-submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: true,
        message: 'ระบบได้รับข้อมูลขอใบเสนอราคาเรียบร้อยแล้ว ทีมงานวิศวกรจะติดต่อกลับโดยเร็วที่สุด',
        timestamp: new Date().toISOString()
      }));
    });
    return;
  }

  let requestUrl = req.url.split('?')[0];
  const decodedUrl = decodeURIComponent(requestUrl);
  if (requestUrl === '/' || decodedUrl === '/หน้าแรก') {
    requestUrl = '/index.html';
  } else if (decodedUrl === '/บริการ' || decodedUrl === '/services') {
    requestUrl = '/services.html';
  }

  const safePath = path.normalize(decodeURIComponent(requestUrl)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>ไม่พบหน้าที่เรียก กรุณากลับสู่หน้าหลัก</p>');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Hi-Den Local Server กำลังทำงานที่: http://localhost:${PORT}`);
  console.log(`รองรับการทำงานออฟไลน์และการจำลอง API ส่งฟอร์มขอใบเสนอราคา`);
});
