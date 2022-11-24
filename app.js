if (!process.env.PROJECT_NAME || !process.env.PROJECT_ID){
  require('dotenv').config();
}

const path = require('path'),
      express = require('express'),
      session = require('express-session'),
      SQLiteStore = require('connect-sqlite3')(session),
      exphbs  = require('express-handlebars'),
      bodyParser = require('body-parser'),
      pubSubHubbub = require('pubsubhubbub'),
      sassMiddleware = require('node-sass-middleware'),
      babelify = require('express-babelify-middleware'),    
      helpers = require(__dirname + '/helpers/general.js'),
      db = require(__dirname + '/helpers/db.js'),
      app = express();

app.use(express.static('public'));

app.use(bodyParser.json({
  type: 'application/activity+json'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  store: new SQLiteStore,
  secret: process.env.ADMIN_PASSWORD,
  resave: true,
  saveUninitialized: true,  
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(sassMiddleware({
  // src: __dirname,
  src: __dirname + '/src/styles',
  dest: path.join(__dirname, 'public'),
  force: true,
  // debug: true,  
  outputStyle: 'compressed',
  response: true
}));

app.use('/js/scripts.js', babelify('src/scripts/scripts.js', {
  minify: true
}));

app.use('/node_modules', express.static(__dirname + '/node_modules/'));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    for: require('./handlebars-helpers/for'),
    equals: require('./handlebars-helpers/equals')
  }  
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', require('./routes/index.js'))
app.use('/admin', require('./routes/admin.js'));
app.use('/bot', require('./routes/bot.js'));
app.use('/delete-post', require('./routes/delete-post.js'));
app.use('/feed', require('./routes/feed.js'));
app.use('/img', express.static(__dirname + '/.data/img/'));

app.use('/inbox', require('./routes/inbox.js'));
app.use('/outbox', require('./routes/outbox.js'));
app.use('/post', require('./routes/post.js'));
app.use('/pubsub', require('./routes/pubsub.js'));
app.use('/salmon', require('./routes/salmon.js'));
app.use('/webhook', require('./routes/webhook.js'));
app.use('/.well-known', require('./routes/well-known.js'));

app.get('/js/helpers.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/helpers/general.js'));
});

module.exports = app;
