var state = 0;


function sendNameRequest(req, accepted, empty, notAccepted){
	socket.emit('nameRequest', req);
	socket.on('nameResponse', function(msg){
      if (msg=="accepted") {
		accepted();
      }
      else if (msg=="empty") {
		empty();      	
      }
      else {
		notAccepted();
      }
	});
}

function nameNext(){
  $('#whoSubmitButton, #whoParagraph, #whoInputBox').animate({'opacity': 0},
    1000,
	'swing',
	window.setTimeout(switchPage, 1000)
  );
}


function setNameRequestListener(){
	$('#whoSubmitButton').bind('click', function(){
      $('#whoSubmitButton').unbind('click');

      sendNameRequest(

      	$('#whoInputBox').val(),

      	accepted = function(){
			$('#nameRequestFeedback').html("<div data-alert class=\"alert-box success radius\">That's a cool name!<a href=\"#\" class=\"close\">&times;</a></div>");			
      	    window.setTimeout(nameNext, 2000);
      	},
      	empty = function(){
			$('#nameRequestFeedback').html("<div data-alert class=\"alert-box warning radius\">You need to enter a name.<a href=\"#\" class=\"close\">&times;</a></div>");		
      		window.setTimeout(setNameRequestListener, 600);
      	},
      	notAccepted = function(){
			$('#nameRequestFeedback').html("<div data-alert class=\"alert-box alert radius\">That's not an accepted name.<a href=\"#\" class=\"close\">&times;</a></div>");      	
      		window.setTimeout(setNameRequestListener, 600);
      	}

      );

    });
}


function sendGameRequest(req, created, starting, progress, bad){
	console.log("{\"gameName\":\"" + req + "\"}");
	socket.emit('gameRequest', "{\"gameName\":\"" + req + "\"}");
    socket.on('gameResponse', function(msg){
      if (msg=="created"){
      	created();
      } else if (msg=="exists-starting"){
        starting();
      } else if (msg=="exists-progress"){
      	progress();
      } else if (msg=="unacceptable"){
      	bad();
      }
    });
}

function gameNext(){
	$('#startSubmitButton, #startParagraph, #startInputBox').animate({'opacity': 0},
	    1000,
	    'swing',
	    window.setTimeout(switchPage, 1000)
    );
}

function setGameRequestListener(){
	$('#startSubmitButton').bind('click', function(){
      $('#startSubmitButton').unbind('click');
      
      sendGameRequest(

      	$('#startInputBox').val(), 

      	created = function(){
      		$('#gameRequestFeedback').html("<div data-alert class=\"alert-box success radius\">The game has been created!<a href=\"#\" class=\"close\">&times;</a></div>");
      		window.setTimeout(gameNext, 2000);
      	},
      	starting = function(){
      		$('#gameRequestFeedback').html("<div data-alert class=\"alert-box success radius\">You've joined the game!<a href=\"#\" class=\"close\">&times;</a></div>");
      		window.setTimeout(gameNext, 2000);
      	},
      	progress = function(){
      		$('#gameRequestFeedback').html("<div data-alert class=\"alert-box info radius\">This game is in progress.  The players must first approve of you joining.<a href=\"#\" class=\"close\">&times;</a></div>");
      		window.setTimeout(gameNext, 2000);
      	},
      	bad = function(){
      		$('#gameRequestFeedback').html("<div data-alert class=\"alert-box alert radius\">Unacceptable input.  What are you doing?<a href=\"#\" class=\"close\">&times;</a></div>");
      		window.setTimeout(setGameRequestListener, 600);
      });

      
    });
}











function lighten(){
  var val = 0;
  function colorValue(){
  	$('body').css('backgroundColor', 'rgb(' + val + ',' + val + ',' + val + ')');
  }
  var asdf = setInterval(function(){colorValue();val+=1;if (val>30) {clearInterval(asdf)};}, 100);
}

function introLanding(){
  $('#landingH1, #landingH2').animate({'opacity': 1},
	1500, 
	'swing', 
	function(){
	  $('#startButton').animate(
	  	{'opacity':1},
	  	600,
	  	'swing')
	}
  );

  $('#startButton').bind('click', function(){
  	$('#startButton').unbind('click');
	$('#landingH2, #landingH1, #startButton').animate({'opacity': 0},
		1000,
		'swing',
		window.setTimeout(switchPage, 1200)
	);
  });
};

function startPlaying(){

  // load ajax stuff
  $('#screenContainer').load('start-playing', function(){
    $('#signUpHeader').animate({'opacity': 1},
    	1500,
    	'swing',
    	function(){
    		$('#startParagraph').animate({'opacity':1},
    			1000,
    			'swing',
    			function(){
    				$('#startInputBox, #startSubmitButton').animate(
    					{'opacity':1},
    					1000,
    					'swing'
    				)
    			})
    });
    setGameRequestListener();
  });


  lighten();

}


function whoAreYou(){

  // load ajax stuff
  $('#screenContainer').load('who-are-you', function(){
    setNameRequestListener();
    $('#whoParagraph').animate({'opacity':1},
    	1000,
    	'swing',
        function(){
    	$('#whoInputBox, #whoSubmitButton').animate(
    		{'opacity':1},
    		1000,
    		'swing'
    	)
    })
  });
}

function processing(){
	$('#screenContainer').load('processing', function(){

	})
}


function switchPage(){
	console.log('switchPage fired');
	if (state == 0) {
      introLanding();
      state += 1;
	}
	else if (state == 1){
	  startPlaying();
	  state += 1;
	}
	else if (state == 2){
	  whoAreYou();
	  state += 1;
	}
	else if (state == 3){
	  processing();
	  state += 1;
	}
}

switchPage();


socket.on('fire', function(msg){
	alert(msg);
});