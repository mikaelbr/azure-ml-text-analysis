const ta = require('../src');
const fs = require('fs');
const st = require('st');
const path = require('path');
const http = require('http');
const NodeCache = require('node-cache');

var cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 60 * 10
});

const keyPath = path.join(__dirname, '..', '.key');
const key = fs.readFileSync(keyPath).toString('utf-8').trim();
const ai = ta(key);

const headers = { 'Content-Type': 'application/json' };

var mount = st({
  index: 'index.html',
  path: __dirname + '/sentiment-textarea',
  url: '/',
  cache: false,
  gzip: false
});

var server = http.createServer(function (req, res) {
  var stHandled = mount(req, res);
  if (stHandled) return;

  var data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', function () {
    try {
      console.log(data);
      var parsed = JSON.parse(data);
      handleResponse(parsed, res);
    } catch (e) {
      console.error(e);
      res.writeHead(500, headers);
      res.end(JSON.stringify({ message: e }));
    }
  });
});

function handleResponse (data, res) {
  const cached = cache.get(data.message);
  if (cached) {
    console.log('from cache');
    res.writeHead(200, headers);
    res.end(JSON.stringify(cached));
    return;
  }
  var type = data.type === 'language' ? 'language' : 'sentiment';
  ai[type](data.message, function (err, _, body) {
    if (err) {
      console.error(err);
      res.writeHead(500, headers);
      res.end(JSON.stringify({ message: err }));
      return;
    }
    cache.set(data.message, body, noop);
    res.writeHead(200, headers);
    res.end(JSON.stringify(body));
  });
}

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Starting server http://localhost:${port}`);

function noop () { }
