const ta = require('../src');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', '.key');
const key = fs.readFileSync(keyPath).toString('utf-8').trim();

ta(key).sentiment('Javascript is the best language in the world!', function (err, res, body) {
  if (err) console.err(err);
  console.log(body);
});
