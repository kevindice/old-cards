// requires
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var safeps = require('safeps');
var mongojs = require('mongojs');

var gameNameRequests = require('./gameNameRequest.js');

// App specific modules for database actions and socket.io stuff
var dbTest = require('./dbresponses.js');

// connect to database
var db = mongojs.connect("cah", ["whiteCards", "blackCards", "games"]);

// number of socket.io connections
var numOfConnections = 0;

// express and socket.io setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// launch grunt processes for livereload and SASS compilation
// eventually JS will be compressed here too.
setTimeout(function(){safeps.exec('grunt server')},1000);

var routes = require('./routes/index');
var posts = require('./routes/posts');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
  numOfConnections += 1;
  console.log(numOfConnections);
  socket.on('disconnect', function(socket){
    console.log('a user disconnected');
    numOfConnections -= 1;
    console.log(numOfConnections);
  });
  socket.on('test', function(msg){
    console.log('message recieved' + msg);
    socket.broadcast.emit('asdf', msg);
  });

  socket.on('moduleTest', function(msg){
    dbTest.getRandomWhiteCard(db, function(response){
      socket.emit('testing', 'In response to ' + msg + ', I say:  ' + response);
    });
  });

  socket.on('gameRequest', function(msg){
    gameNameRequests.handleGameNameRequest(msg, socket, db);
  });

  socket.on('broadcastMessage', function(msg){
    socket.broadcast.emit('fire', msg);
  });

  socket.on('nameRequest', function(msg){
    if (msg == 'kevin')
      socket.emit('nameResponse', 'accepted');
    else if(msg == '')
      socket.emit('nameResponse', 'empty');
    else
      socket.emit('nameResponse', 'lol...no');
  });

});

app.use('/', routes);
app.use('/', posts);

app.get('/randomCard', function(req, res){
  var callback = function(respObj){
    res.send("<html style=\"width: 100vw;font-size: 40px;\"><body style=\"width: 100vw; overflow: wrap; margin: 0; padding: 0;\"><div style=\"margin:0; padding: 1em; height:100vh ; width:100vw; color: white; background: black; font-family: Arial;\"><h1>Random Card</h1><p>Card Number:  " + respObj.num + "</p><p>Expansion Pack:  " + respObj.expansionPack + "</p><p style=\"font-size: 1.3em;\">" + respObj.content + "</p><br><br><a style=\"color: magenta; font-size: 2em;\" href=\"http://cah.kevindice.com:8080/randomCard\">More</a></div></body></html>");
  };
  dbTest.getRandomWhiteCard(db, callback);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(8080, function(){
  console.log('Listening on 8080');
});

module.exports = app;
