![An example of a bot posting generated image](https://cdn.glitch.com/a4825d5c-d1d6-4780-8464-8636780177ef%2Fglitch-fediverse-bot-with-image.png)

# Generative art bot

This is an example of a bot that generates images. It uses an image generator from [generative-art-bot](https://glitch.com/edit/#!/generative-art-bot).

(Note that the code needed to be slightly modified to work with this project.)

To try this example, copy the content of `examples/generative-art-bot/routes/bot-endpoint.js` to `routes/bot-endpoint.js` file and run your bot using its endpoint.

By default, the images are stored in the `.data/img` folder. Glitch only provides ~128MB of storage (there are technical limitations to using the `assets` folder, which gives you additional ~500MB), but you can upload your images to NeoCities, which comes with a free 1GB of space, and has a paid plan ([$5/month](https://neocities.org/supporter)) that offers 50GB.

Simply sign up for an account at [neocities.org](https://neocities.org/), and save your login information to the `.env` file as `NEOCITIES_USERNAME` and `NEOCITIES_PASSWORD`.

