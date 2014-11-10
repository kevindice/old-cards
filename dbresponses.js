var exports = module.exports = {};

exports.getRandomWhiteCard = function(db, callback){
  db.whiteCards.count(function(err, count){
  	var rand = Math.floor((Math.random() * count));
  	db.whiteCards.find().limit(-1).skip(rand).next(function(err, response){
  		process.nextTick(function(){
  			callback({content: response.content, num: "Number: " + rand, expansionPack: response.pack});
  		});
  	});
  });
}