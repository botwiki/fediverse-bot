const express = require('express'),
      session = require('express-session'),
      router = express.Router(),
      moment = require('moment'),
      db = require(__dirname + '/../helpers/db.js'),
      bot = require(__dirname + '/../bot/bot.js');

router.get('/', (req, res) => {
  res.render('../views/admin.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    bot_avatar_url: process.env.BOT_AVATAR_URL,
    bot_username: process.env.BOT_USERNAME,
    bot_name: process.env.BOT_NAME,
    bot_description: process.env.BOT_DESCRIPTION
  });    
});

router.get('/logout', (req, res) => {
  req.session.is_admin = false;
  req.session.save();

  console.log('admin logged out');      
  console.log(req.body);
  res.redirect('/');
});

router.post('/', (req, res) => {
  if (process.env.ADMIN_PASSWORD && req.body.password){
    if (req.body.password === process.env.ADMIN_PASSWORD){
      req.session.is_admin = true;
      req.session.save();
      console.log('saving session...', req.session.is_admin);

      req.session.save((err) => {
        console.log('admin logged in');        
        res.redirect('/');
      });
    }
    else{
      req.session.is_admin = false;     
      console.log('failed login attempt');      
      console.log(req.body);
      res.redirect('/admin');
    }
  }  
});

module.exports = router;
