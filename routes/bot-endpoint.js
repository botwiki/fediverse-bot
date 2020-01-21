var express = require('express'),
    router = express.Router(),
    grammar = require(__dirname + '/../tracery/tracery.js').grammar,
    bot = require(__dirname + '/../bot/bot.js');

router.get('/', function (req, res) {
  var content = grammar.flatten("#origin#");
  
  bot.createPost({
    type: 'Note', // See www.w3.org/ns/activitystreams#objects
    content: content
  }, function(err, message){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(message));
  });
});

module.exports = router;
