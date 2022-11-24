const fs = require('fs'),
      url = require('url'),
      util = require('util'),
      bot = require(__dirname + '/../bot/bot.js'),
      express = require('express'),
      router = express.Router();

router.get('/webfinger', (req, res) => {
  const urlPparts = url.parse(req.url, true),
        query = urlPparts.query;

  console.log('webfinger request', query, {
    subject: query.resource,
    links: bot.links
  });

  res.json({
    subject: query.resource,
    links: bot.links
  });
});

module.exports = router;
