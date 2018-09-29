var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    db = require(__dirname + '/../helpers/db.js'),
    bot = require(__dirname + '/../bot.js');

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
      
      if (data && data.posts && data.posts.length > 0){
        data.posts.forEach(function(post){
          post.date_formatted = moment(post.date).fromNow();
        });
      }
      
      var show_next_page = false,
          show_previous_page = false;
            
      if (page < data.page_count){
        show_next_page = true;
      }

      if (page > 1 && page <= data.page_count){
        show_previous_page = true;
      }

      res.render('../views/home.handlebars', {
        project_name: process.env.PROJECT_DOMAIN,
        bot_avatar_url: process.env.BOT_AVATAR_URL,
        bot_username: process.env.BOT_USERNAME,
        bot_description: process.env.BOT_DESCRIPTION,
        page_title: process.env.BOT_USERNAME,
        page_description: process.env.BOT_DESCRIPTION,
        post_count: data.post_count,
        page_count: data.page_count,
        posts: data.posts,
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
