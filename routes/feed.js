const express = require('express'),
      router = express.Router(),
      RSS = require('rss'),
      moment = require('moment'),
      dbHelper = require(__dirname + '/../helpers/db.js');

router.get('/', (req, res) => {
  let xml = '';

  console.log('rendering feed...');
    dbHelper.getPosts(null, (err, data) => {
      console.log(err, data);
      if (data && data.posts){
        xml = `<?xml version="1.0"?>
  <feed xmlns="http://www.w3.org/2005/Atom" xmlns:thr="http://purl.org/syndication/thread/1.0" xmlns:activity="http://activitystrea.ms/spec/1.0/" xmlns:poco="http://portablecontacts.net/spec/1.0" xmlns:media="http://purl.org/syndication/atommedia" xmlns:ostatus="http://ostatus.org/schema/1.0" xmlns:mastodon="http://mastodon.social/schema/1.0">
    <id>https://${process.env.PROJECT_DOMAIN}.glitch.me/feed</id>
    <title>${process.env.BOT_NAME}</title>
    <subtitle>${process.env.BOT_DESCRIPTION}</subtitle>
    <updated>2018-09-14T18:15:10Z</updated>
    <logo>${process.env.BOT_AVATAR_URL}</logo>
    <author>
      <id>https://${process.env.PROJECT_DOMAIN}.glitch.me</id>
      <activity:object-type>http://activitystrea.ms/schema/1.0/service</activity:object-type>
      <uri>https://${process.env.PROJECT_DOMAIN}.glitch.me</uri>
      <name>${process.env.BOT_USERNAME}</name>
      <email>bot@${process.env.PROJECT_DOMAIN}.glitch.me</email>
      <summary type="html">&lt;p&gt;${process.env.BOT_DESCRIPTION}&lt;/p&gt;</summary>
      <link rel="alternate" type="text/html" href="https://${process.env.PROJECT_DOMAIN}.glitch.me"/>
      <link rel="avatar" type="image/jpeg" media:width="120" media:height="120" href="${process.env.BOT_AVATAR_URL}"/>
      <link rel="header" type="image/jpeg" media:width="700" media:height="335" href="${process.env.BOT_AVATAR_URL}"/>
      <poco:preferredUsername>${process.env.BOT_USERNAME}</poco:preferredUsername>
      <poco:displayName>${process.env.BOT_NAME}</poco:displayName>
      <poco:note>${process.env.BOT_DESCRIPTION}</poco:note>
      <mastodon:scope>public</mastodon:scope>
    </author>
    <link rel="alternate" type="text/html" href="https://${process.env.PROJECT_DOMAIN}.glitch.me"/>
    <link rel="self" type="application/atom+xml" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/feed"/>
    <link rel="next" type="application/atom+xml" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/feed?max_id=99999999999"/>
    <link rel="hub" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/pubsub"/>
    <link rel="salmon" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/salmon"/>`;

      data.posts.forEach((post) => {
        // post.date_formatted = moment(post.date).fromNow();
        xml += `<entry>
                  <id>https://${process.env.PROJECT_DOMAIN}.glitch.me/post/${post.id}</id>
                  <published>${moment(post.date)}</published>
                  <updated>${moment(post.date)}</updated>
                  <title>New status by ${process.env.BOT_USERNAME}</title>
                  <activity:object-type>http://activitystrea.ms/schema/1.0/comment</activity:object-type>
                  <activity:verb>http://activitystrea.ms/schema/1.0/post</activity:verb>
                  <link rel="alternate" type="application/activity+json" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/post/${post.id}"/>
                  <content type="html" xml:lang="en">&lt;p&gt;&lt;span class="h-card"&gt;&lt;a href="https://mastodon.social/@metalbob" class="u-url mention"&gt;@&lt;span&gt;metalbob&lt;/span&gt;&lt;/a&gt;&lt;/span&gt; i suppose it&amp;apos;s possible although hopefully it never becomes actual law&lt;/p&gt;</content>
                  <link rel="mentioned" ostatus:object-type="http://activitystrea.ms/schema/1.0/service" href="https://mastodon.social/users/metalbob"/>
                  <link rel="mentioned" ostatus:object-type="http://activitystrea.ms/schema/1.0/collection" href="http://activityschema.org/collection/public"/>
                  <mastodon:scope>public</mastodon:scope>
                  <link rel="self" type="application/atom+xml" href="https://${process.env.PROJECT_DOMAIN}.glitch.me/post/${post.id}?format=xml"/>
                </entry>`;
      });

    xml += '\n</feed>';        
    }

    res.setHeader('Content-Type', 'application/rss+xml');
    // res.send(feed.xml({indent: true}));
    res.send(xml);
  });
});

module.exports = router;
