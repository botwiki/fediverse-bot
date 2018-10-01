![Glitch Fediverse bot](https://cdn.glitch.com/a4825d5c-d1d6-4780-8464-8636780177ef%2Fglitch-fediverse-bot-small-1024px.png?1538225347895)

# Glitch Fediverse bot

*Work in progress.*

## Bot logic (the back end)

- Your bot's logic is inside the `routes/bot-endpoint.js` file. This is the code that runs when you access your bot's endpoint, as defined inside the `.env` file.
- `TBD`

## The look of your bot's page (the front end)

- You can update the style files inside `src/styles`. You can use [sass](https://sass-lang.com/guide), it will be compiled using [node-sass-middleware](https://github.com/sass/node-sass-middleware).
- Update the scripts inside `src/scripts`. You can use [ES6](http://es6-features.org/#Constants), you script files will be compiled using [express-babelify-middleware](https://github.com/luisfarzati/express-babelify-middleware).
- All templates are inside the `views` folder and use [handlebars.js](http://handlebarsjs.com/).

## TO-DO:

- ~~profile customization via .env~~
- ~~account discovery via webfinger~~
- ~~follow the bot~~
- ~~unfollow the bot~~
- ~~notify followers about new posts~~
- ~~add post pagination~~
- a way to delete posts (password-protected, with the password stored in `.env`)
  - ~~create admin login interface~~
  - ~~create endpoint for deleting posts~~
  - send Delete message to Mastodon
  - add confirmation before post gets deleted
- upload images:
  - https://neocities.org/api, https://neocities.org/supporter, https://github.com/neocities/neocities-node
  - https://www.digitalocean.com/products/spaces/, https://glitch.com/~digitalocean-spaces-example
  - Flickr API
- reply to messages
- verify the payload

## Resources:

- https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/
- https://github.com/tootsuite/mastodon/issues/1441
- https://github.com/dariusk/express-activitypub

## Notes

- https://glitch-fediverse-bot.glitch.me/.well-known/webfinger?resource=acct:bot@glitch-fediverse-bot.glitch.me
- https://glitch-fediverse-bot.glitch.me/bot?debug=true



Powered by [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
