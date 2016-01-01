var request = require('request');

const baseUrl = 'https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/';
const endpoints = {
  'sentiment': 'GetSentiment',
  'keyPhrases': 'GetKeyPhrases',
  'language': 'GetLanguage'
};

module.exports = function (key) {
  const headers = getHeaders(key);
  return Object.keys(endpoints).reduce(function (api, key) {
    api[key] = fetch.bind(null, headers, endpoints[key]);
    return api;
  }, {});
};

function fetch (headers, endpoint, text, cb) {
  return request({
    url: `${baseUrl}${endpoint}?Text=${encodeURIComponent(text)}`,
    json: true,
    headers
  }, cb);
}

function getCredentials (key) {
  return atob(`AccountKey:${key}`);
}

function getHeaders (key) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${getCredentials(key)}`
  };
}

function atob (str) {
  return new Buffer(str).toString('base64');
}
