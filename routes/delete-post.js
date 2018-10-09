var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    bot = require(__dirname + '/../bot/bot.js'),
    db = require(__dirname + '/../helpers/db.js');

router.get('/:id',  function(req, res) {
  var is_admin = req.session.is_admin,
      post_id = req.params.id;
  
  if (is_admin){
    console.log({
      'delete post': post_id
    });

    db.delete_post(post_id, function(err){
      if (err){
        console.log(`error deleting post ${post_id}`, err);
      } else {
        console.log(`deleted post ${post_id}`);

        db.get_followers(function(err, followers){
          console.log('followers:', followers);
          followers.forEach(function(follower){
            if (follower.url){
              bot.delete_post(post_id, follower.url, function(err, data){

              });
            }
          });
        });
      }
    });
    res.redirect('/');
  }
  else{
    res.redirect('/admin');
  }  
});

module.exports = router;
