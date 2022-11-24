const express = require('express'),
      router = express.Router(),
      moment = require('moment'),
      db = require(__dirname + '/../helpers/db.js');

router.get('/:id', (req, res) => {
  const postID = req.params.id;
  
  db.getPost(postID, (err, post_data) => {
    if (post_data){
      post_data.date_formatted = moment(post_data.date).fromNow();;

      try{
        post_data.attachment = JSON.parse(post_data.attachment);
      } catch(err){ /*noop*/ }

      
      res.render('../views/post.handlebars', {
        project_name: process.env.PROJECT_DOMAIN,
        bot_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,        
        bot_avatar_url: process.env.BOT_AVATAR_URL,
        bot_username: process.env.BOT_USERNAME,
        bot_description: process.env.BOT_DESCRIPTION,
        is_admin: req.session.is_admin,
        page_title: `${process.env.BOT_NAME}: ${post_data.date}`,
        page_description: post_data.content,
        post: post_data
      });      
    }
    else{
      res.render('../views/404.handlebars', {
        project_name: process.env.PROJECT_DOMAIN,
        bot_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,        
        bot_avatar_url: process.env.BOT_AVATAR_URL,
        bot_username: process.env.BOT_USERNAME,
        bot_description: process.env.BOT_DESCRIPTION,
        page_title: `${process.env.BOT_NAME}: Page not found`,
        is_admin: req.session.is_admin
      });      
    }  
  });
});

module.exports = router;
