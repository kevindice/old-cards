var util = require('./util.js');
var exports = module.exports = {};



var gameRequestSuccess = function(gameNameRequestObject, socket, db){
	var reqGameName = gameNameRequestObject.gameName;
	if (reqGameName.length < 5){  // If not long enough
		// Reject Game Request
		console.log("Unacceptable - The JSON parsed but was not long enough.");
		socket.emit('gameResponse', 'unacceptable-length');
	}
	else{
		// Process Valid Game Request
		db.games.find({"nameOfGame": reqGameName}).count(function(err, count){
			if (count == 1) { // If game already exists
				// check game status
				db.games.find({"nameOfGame": reqGameName}, function(err, response){
					if (response[0].statusOfGame == 'forming') {
						console.log("game is forming");
						socket.emit('gameResponse', 'exists-starting');
					} else if (response[0].statusOfGame == 'inProgress') {
						console.log("game is in progress");
						socket.emit('gameResponse', 'exists-progress');
					}
				});
			}
			else if(count == 0) {
				// create game by inserting it into the database
				db.games.insert({
					nameOfGame: reqGameName,
					timeStarted: util.getUnixTime(),
					statusOfGame: "forming",
					members: ['idOfInitiatingMember']
				}, function(){
					// tell the client the game was created
					console.log("Game Created");
					socket.emit('gameResponse', 'created');
				});
			}
		});
	}
}

var gameRequestFailure = function(socket, msgJSON){
	socket.emit('gameResponse', 'unacceptable');
}

// end functions for game requests

exports.handleGameNameRequest = function(msgJSON, socket, db) {
	// try to parse the JSON data
	util.tryParseJSON(msgJSON, 
		function(gameNameRequestObject){
		  gameRequestSuccess(gameNameRequestObject, socket, db);
		},
		function(){
		  gameRequestFailure(socket, msgJSON);	
		}
	);
}






//    if(msg == 'test123')
//      socket.emit('gameResponse', 'created');
//    else if(msg == 'test456')
//      socket.emit('gameResponse', 'exists-starting');
//    else if(msg == 'test789')
//      socket.emit('gameResponse', 'exists-progress');
//    else
//      socket.emit('gameResponse', 'unacceptable')