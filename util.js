var exports = module.exports = {};

exports.tryParseJSON = function (jsonString, success, failure){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            process.nextTick(function(){
            	success(o);
            });
        }
    }
    catch (e) {
    	process.nextTick(function(){
    		failure(o);
    	});
    }
};

exports.getUnixTime = function (){
	return new Date().getTime();
}