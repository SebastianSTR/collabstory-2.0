var allTweets = [];
var rootTweetId, rootUser;


var activeNode = 0;

rootUser = "collabstory";
rootTweetId = "606254222389219328"; 


// rootUser = "BarackObama";
// rootTweetId = "606538032804601856"; 



$( document ).ready(function() {
	document.body.addEventListener('doneLoadingTweets', function (e) { 
	  // initializeViews();
	  initializeTree();
	  
	  //Draw Tree on DocumentReady//
	  var windowhoehe = $(window).height();
	  var windowbreite = $(window).width();
	  drawtree();


		  //zufaelligen Link bei Start aussuchen aussuchen
		activeNode = Math.floor(Math.random()*$(".is-leaf").length);
		$(".is-leaf").eq(activeNode).click();

	  //Redraw Tree on Resize//
	  $( window ).resize(function() {
	    $('#tree').remove();
	    width = window.innerWidth;
	 	height = window.innerHeight;
	    drawtree();
	    $(".node").eq(activeNode).click();
	  });
	}, false);

	loadTweets();

});