//require our dependencies
var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('mongoose'),
  mongoose = require('mongoose'),
  twitter = require('ntwitter'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

  //create an experss instance and set a port variable
  var app = express();
  var port = process.env.PORT || 8080;

  //set handlebars as the templating engine
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');

  //disable etag headers on responses
  app.disable('etag');

  //connect to our mongo database
  mongoose.connect('mongodb://localhost/react-tweets');

  //create a new ntwitter instance
  var twit = new tiwtter(config.twitter);

  //Index route
  app.get('/', routes.index);

  //Page route
  app.get('/Page/:page/:skip', routes.page);

  //set /public as our static content dir
  app.use('/', express.static(__dirname + '/public'));

  //fire it up ( start our server)
  var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
  });

  //initialize socket.io
  var io = require('socket.io').listen(server);

  //set a stream listener for tweets matching tracking keywords
  twit.stream('status/filter',{ track: 'Allah, bism'}, function(stream) {
    streamHandler(stream,io);
  });