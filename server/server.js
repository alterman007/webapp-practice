const fs = require('fs');
const path = require('path');
const express = require('express');
const ReactSSR = require('react-dom/server');
const app = express();

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  const devStatic = require('./util/dev.static');
  devStatic(app);
} else {
  const serverEntry = require('../dist/server.entry');
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');

  app.use('/public', express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    const appString = ReactSSR.renderToString(serverEntry.default);
    res.send(template.replace('<!-- app -->', appString));
  });
}

app.listen(3333, () => {
  console.log('server is listening on http://localhost:3333');
});
