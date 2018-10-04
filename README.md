**Note**: This project is under active development and not available for remixing, but you can [import it from GitHub](https://glitch.com/#!/import/github/fourtonfish/glitch-fediverse-bot).


![Glitch Fediverse bot](https://cdn.glitch.com/a4825d5c-d1d6-4780-8464-8636780177ef%2Fglitch-fediverse-bot-small-1024px.png?1538225347895)


# Glitch Fediverse bot

With this Glitch starter project, you can create a bot that anyone [in the fediverse](https://en.wikipedia.org/wiki/Fediverse) can follow. This project is still in early development with more features coming.

To automate your bot, set up a free service like [cron-job.org](https://cron-job.org/en/), [Uptime Robot](https://uptimerobot.com/), or [a similar one](https://www.google.com/search?q=free+web+cron) to wake up your bot [every 25+ minutes](https://support.glitch.com/t/a-simple-twitter-bot-template/747/16). Use `https://YOUR_PROJECT_NAME.glitch.me/BOT_ENDPOINT` as a URL to which to send the HTTP request. (`BOT_ENDPOINT` is set in your `.env` file.)

## Bot administration

You can log into the admin panel by going to `YOUR_PROJECT_NAME.glitch.me/admin` and logging in using the password set inside your `.env` file. This will allow you to delete your bot's posts one by one. (Multi-post deletion is coming!)

## Bot logic (the back end)

Your bot's logic is inside the `routes/bot-endpoint.js` file. This is the code that runs when you access your bot's endpoint, as defined inside the `.env` file. See the `examples` folder for some examples of what your bot can do.

## The look of your bot's page (the front end)

You can update the style files inside `src/styles`. You can use [sass](https://sass-lang.com/guide), it will be compiled using [node-sass-middleware](https://github.com/sass/node-sass-middleware). Update the scripts inside `src/scripts`.

You can use [ES6](http://es6-features.org/#Constants), you script files will be compiled using [express-babelify-middleware](https://github.com/luisfarzati/express-babelify-middleware). All templates are inside the `views` folder and use [handlebars.js](http://handlebarsjs.com/).

## TO-DO:

- ~~profile customization via .env~~
- ~~account discovery via webfinger~~
- ~~follow the bot~~
- ~~unfollow the bot~~
- ~~notify followers about new posts~~
- ~~add post pagination~~
- ~~a way to delete posts (password-protected, with the password stored in `.env`)~~
  - ~~create admin login interface~~
  - ~~create endpoint for deleting posts~~
  - ~~send Delete message to Mastodon~~
  - ~~add confirmation before post gets deleted~~
- upload images:
  - ~~https://neocities.org/api, https://neocities.org/supporter, https://github.com/neocities/neocities-node~~
  - https://www.digitalocean.com/products/spaces/, https://glitch.com/~digitalocean-spaces-example
  - Flickr API
  - ~~as a fallback, use the `.data/img` folder~~
- reply to messages
- add link to `/admin`
- delete multiple posts at once (on the `/admin` page)
- verify the payload

## Resources:

- [ActivityPub documentation](https://github.com/w3c/activitypub) (github.com)
- [How to implement a basic ActivityPub server](https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/) (blog.joinmastodon.org)
- [What is necessary for Mastodon to be able to fetch my profile and a list of posts from my blog?](https://github.com/tootsuite/mastodon/issues/1441) (github.com)
- [express-activitypub](https://github.com/dariusk/express-activitypub) (github.com)

## Debugging/testing

- [webfinger output](https://glitch-fediverse-bot.glitch.me/.well-known/webfinger?resource=acct:bot@glitch-fediverse-bot.glitch.me)
- [the Actor object](https://glitch-fediverse-bot.glitch.me/bot?debug=true)


Powered by [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
