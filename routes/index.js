var express = require('express'),
    session = require('express-session'),
    router = express.Router(),
    moment = require('moment'),
    db = require(__dirname + '/../helpers/db.js'),
    bot = require(__dirname + '/../bot/bot.js');

router.get('/', function (req, res) {
  // console.log(req.headers);
  // console.log(JSON.stringify(actor));
  
  if (req.headers && req.headers['user-agent'] && req.headers['user-agent'].indexOf('Mastodon') !== -1 ){  
    console.log(req.headers['user-agent']);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bot.info));
  }
  else{
    var page = parseInt(req.query.page) || 1;
        
    db.get_posts({
      page: page
    }, function(err, data){
      // console.log(posts);
      
      var no_posts = false;
      
      if (data && data.posts && data.posts.length > 0){
        data.posts.forEach(function(post){
          post.date_formatted = moment(post.date).fromNow();
          try{
            post.attachment = JSON.parse(post.attachment);
          } catch(err){ /*noop*/ }
        });
      } else {
        no_posts = true;
      }
      
      var show_next_page = false,
          show_previous_page = false;
            
      if (page < data.page_count){
        show_next_page = true;
      }

      if (page > 1 && page <= data.page_count){
        show_previous_page = true;
      }
      
      console.log(data.page_count, data.page_count > 1)
      
      res.render('../views/home.handlebars', {
        project_name: process.env.PROJECT_DOMAIN,
        bot_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,        
        bot_avatar_url: process.env.BOT_AVATAR_URL,
        bot_username: process.env.BOT_USERNAME,
        bot_description: process.env.BOT_DESCRIPTION,
        page_title: process.env.BOT_USERNAME,
        page_description: process.env.BOT_DESCRIPTION,
        is_admin: req.session.is_admin,
        post_count: data.post_count,
        page_count: data.page_count,
        posts: data.posts,
        no_posts: no_posts,
        current_page: page,
        show_pagination: data.page_count > 1,
        next_page: page + 1,
        previous_page: page - 1,
        show_next_page: show_next_page,
        show_previous_page: show_previous_page
      });
      
    });
  }
});

module.exports = router;
