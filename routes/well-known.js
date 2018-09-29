var fs = require('fs'),
    url = require('url'),
    util = require('util'),
    bot = require(__dirname + '/../bot.js');

var express = require('express'),
    router = express.Router();

router.get('/webfinger', function (req, res) {
  var url_parts = url.parse(req.url, true),
      query = url_parts.query;

  // console.log('webfinger request', query, {
  //   subject: query.resource,
  //   links: bot.links
  // });

  res.json({
    subject: query.resource,
    links: bot.links
  });
});

module.exports = router;
