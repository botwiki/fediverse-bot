var fs = require('fs'),
    url = require('url'),
    util = require('util'),
    bot = require(__dirname + '/../bot.js');

var express = require('express'),
    router = express.Router();

router.all('/', function (req, res) {
  var url_parts = url.parse(req.url, true);

  console.log('/salmon', url_parts);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    error: null
  }));
});

module.exports = router;
