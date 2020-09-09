![Fediverse bot feed](https://cdn.glitch.com/a4825d5c-d1d6-4780-8464-8636780177ef%2Ffeed-comb.png)

# Fediverse bot

Make creative online bots that anyone [in the fediverse](https://en.wikipedia.org/wiki/Fediverse) can follow! This project is [under active development](https://github.com/botwiki/fediverse-bot/issues) and contributions and feature suggestions are welcome.

- [Import to Glitch](https://glitch.com/#!/import/github/botwiki/fediverse-bot) ([Learn more](https://glitch.com/about))


## Bot administration

You can log into the admin panel by going to `/admin` and logging in using the password set inside your `.env` file. This will allow you to delete your bot's posts one by one. (Multi-post deletion is coming!)

## Bot logic (the back end)

1. Update your bot's main script in `bot/script.js`.
2. Set up your bot's schedule in `server.js`.

```
( new CronJob( cronSchedules.EVERY_SIX_HOURS, function() { bot.script() } ) ).start();
```

See `helpers/cron-schedules.js` for common schedules, or the cron package documentation at https://www.npmjs.com/package/cron to create your own.

## The look of your bot's page (the front end)

You can update the style files inside `src/styles`. You can use [sass](https://sass-lang.com/guide), it will be compiled using [node-sass-middleware](https://github.com/sass/node-sass-middleware). Update the scripts inside `src/scripts`.

You can use [ES6](http://es6-features.org/#Constants), you script files will be compiled using [express-babelify-middleware](https://github.com/luisfarzati/express-babelify-middleware). All templates are inside the `views` folder and use [handlebars.js](http://handlebarsjs.com/).

## TO-DO:

[See issues on GitHub.](https://github.com/fourtonfish/fediverse-bot/issues)

## Resources:

- [ActivityPub documentation](https://github.com/w3c/activitypub) (github.com)
- [How to implement a basic ActivityPub server](https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/) (blog.joinmastodon.org)
- [What is necessary for Mastodon to be able to fetch my profile and a list of posts from my blog?](https://github.com/tootsuite/mastodon/issues/1441) (github.com)
- [express-activitypub](https://github.com/dariusk/express-activitypub) (github.com)

## Debugging/testing

- [webfinger output](https://fediverse-bot.glitch.me/.well-known/webfinger?resource=acct:bot@fediverse-bot.glitch.me)
- [the Actor object](https://fediverse-bot.glitch.me/bot?debug=true)
