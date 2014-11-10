var express = require('express');
var router = express.Router();

function toCamelCase(sentenceCase) {
    var out = "";
    sentenceCase.split(" ").forEach(function (el, idx) {
        var add = el.toLowerCase();
        out += (idx === 0 ? add : add[0].toUpperCase() + add.slice(1));
    });
    return out;
}

function routePage(value, index, array){
	var hyph = value.replace(/ +/g, '-').toLowerCase();
	var camel = toCamelCase(value);
	router.get('/' + hyph, function(req, res){
      res.render(camel, {
        title: value,
        jsForPage: '/javascripts/' + camel + '.js',
        cssBodyClass: camel
      });
	});
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landingPage', {
  	title: 'Cards Against Humanity.',
    jsForPage: '/javascripts/landingPage.js',
    cssBodyClass: 'landingPage'
  });
});

//router.get('/start-playing', function(req, res){
//  res.render('startPlaying', {
//    title: 'Start Playing',
//    jsForPage: '/javascripts/startPlaying.js',
//    cssBodyClass: 'startPlaying'
//  });
//});

var pages = ['Start Playing', 'Who Are You', 'processing', 'Game'];

pages.forEach(routePage);

module.exports = router;
