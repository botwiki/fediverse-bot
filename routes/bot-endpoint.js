var express = require('express'),
    url = require('url'),
    router = express.Router(),
    grammar = require(__dirname + '/../tracery/tracery.js').grammar,
    db = require(__dirname + '/../helpers/db.js'),    
    bot = require(__dirname + '/../bot.js');

router.get('/', function (req, res) {
  var content = grammar.flatten("#origin#");
  
  bot.create_post({
    content: content
  }, function(err, message){
    var domains = [];
    
    db.get_followers(function(err, followers){
      console.log('followers:', followers);
      followers.forEach(function(follower){
        if (follower.url){
          bot.sign_and_send({
            follower: follower,
            message: message
          });
        }
      });
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(message));
  });
});

module.exports = router;
