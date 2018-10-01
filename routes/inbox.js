var fs = require('fs'),
    url = require('url'),
    crypto = require('crypto'),
    util = require('util'),
    db = require(__dirname + '/../helpers/db.js'),
    bot = require(__dirname + '/../bot.js');


var express = require('express'),
    router = express.Router();

router.post('/', function (req, res) {
  var url_parts = url.parse(req.url, true),
      payload = req.body;

  console.log('/inbox');  
  /*
    TODO: Verify the message.
  */

  if (payload.type === 'Follow'){
    
    bot.accept(payload, function(err, payload, data){
      db.save_follower(payload, function(err, data){
        console.log(`new follower ${payload.actor} saved`); 
      });

      res.status(200);
    });
  }
  else if (payload.type === 'Undo'){
    bot.accept(payload, function(err, payload, data){
      db.remove_follower(payload, function(err, data){
        console.log(`removed follower ${payload.actor}`); 
      });

      res.status(200);
    });
  }
  else if (payload.type === 'Delete'){
    // console.log('payload', payload);  
    console.log('Delete /*noop*/');  
    res.status(200);
  }
  else{
    console.log('payload', payload);  
    res.status(200);    
  }
});

module.exports = router;
