// general requires
var util = require('./util.js');


// launch grunt processes for livereload and SASS compilation
// eventually JS will be compressed here too.
var safeps = require('safeps');
setTimeout(function(){safeps.exec('grunt server')},1000);


// connect to database
var mongojs = require('mongojs');
var db = mongojs.connect("cah", ["whiteCards", "blackCards", "games"]);


// express and socket.io setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// view engine setup
// Use view directory
var path = require('path');
app.set('views', path.join(__dirname, 'views'));


// Use jade to render stuff
app.set('view engine', 'jade');


// Set the favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));


// Log the requests and everything with morgan 
var logger = require('morgan');
app.use(logger('dev'));


// Set up the body-parser to 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set up the cookieParser
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// What happens when a socket.io connection is established?
io.on('connection', function(socket){

  socket.on('disconnect', function(socket){

  });

  socket.on('gameRequest', function(msg){
    util.tryParseJSON(msg, 
      function parseSucceeded(reqObj){
        socket.join(reqObj.gameName);
        //if (Object.keys(io.adapter.rooms[reqObj.gameName]).length == 1) {
          //console.log('made Master');
          //socket.on('roomBroadcast', function(msg){
            //io.to(reqObj.gameName).emit('fire', msg);
          //});
        //};
        socket.emit('gameResponse', 'created');
      },
      function parseFailed(){
        socket.emit('gameResponse', 'unacceptable');
      }
    );
    // Outdated
    //gameNameRequests.handleGameNameRequest(msg, socket, db);
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



// Set up routes for other stuff
var routes = require('./routes/index');
var posts = require('./routes/posts');
app.use('/', routes);
app.use('/', posts);


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
