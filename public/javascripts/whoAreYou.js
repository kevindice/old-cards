$('p').animate({'opacity': 1},
	1500, 
	'swing', 
	function(){
	  $('#yourName').animate(
	    {'opacity':1},
	  	1000,
	  	'swing', function(){
	    $('.submitStuff').animate(
	  	  {'opacity':1},
	  	  1000,
	  	  'swing');}
	    );
	}
);