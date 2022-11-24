const fs = require('fs'),
      express = require('express'),
      session = require('express-session'),
      router = express.Router(),
      moment = require('moment'),
      db = require(__dirname + '/../helpers/db.js'),
      bot = require(__dirname + '/../bot/bot.js'),
      publicKeyPath = '.data/rsa/pubKey';


router.get('/', (req, res) => {
  // console.log(req.headers);
  // console.log(JSON.stringify(actor));
  
  if (req.headers && req.headers['user-agent'] && req.headers['user-agent'].indexOf('Mastodon') !== -1 ){  
    console.log(req.headers['user-agent']);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bot.info));
  }
  else{
    let page = parseInt(req.query.page) || 1;
        
    db.getPosts({
      page: page
    }, (err, data)=> {
      // console.log(posts);
      
      let noPosts = false;
      
      if (data && data.posts && data.posts.length > 0){
        data.posts.forEach((post)=> {
          post.date_formatted = moment(post.date).fromNow();
          try{
            post.attachment = JSON.parse(post.attachment);
          } catch(err){ /*noop*/ }
        });
      } else {
        noPosts = true;
      }
      
      let showNextPage = false,
          showPreviousPage = false;
            
      if (page < data.page_count){
        showNextPage = true;
      }

      if (page > 1 && page <= data.page_count){
        showPreviousPage = true;
      }
      
      res.render('../views/home.handlebars', {
        project_name: process.env.PROJECT_DOMAIN,
        bot_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,        
        bot_avatar_url: process.env.BOT_AVATAR_URL,
        bot_username: process.env.BOT_USERNAME,
        bot_description: process.env.BOT_DESCRIPTION,
        page_title: process.env.BOT_NAME,
        page_description: process.env.BOT_DESCRIPTION,
        is_admin: req.session.is_admin,
        post_count: data.post_count,
        page_count: data.page_count,
        posts: data.posts,
        has_posts: !noPosts,
        no_posts: noPosts,
        current_page: page,
        show_pagination: data.page_count > 1,
        next_page: page + 1,
        previous_page: page - 1,
        show_next_page: showNextPage,
        show_previous_page: showPreviousPage,
        show_admin_link: process.env.SHOW_ADMIN_LINK && 
        (process.env.SHOW_ADMIN_LINK === 'true' || process.env.SHOW_ADMIN_LINK === 'yes' ? true : false)
      });
    });
  }
});

router.get('/about', (req, res) => {
  res.render('../views/about.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    bot_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,        
    bot_avatar_url: process.env.BOT_AVATAR_URL,
    bot_username: process.env.BOT_USERNAME,
    bot_description: process.env.BOT_DESCRIPTION,
    page_title: process.env.BOT_NAME,
    page_description: process.env.BOT_DESCRIPTION
  });
});

router.get('/id.pub', (req, res) => {
  let publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  fs.readFile(publicKeyPath, 'utf8', (err, contents) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(contents);
    res.end();
  });

});

module.exports = router;
