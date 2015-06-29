


$("#knopf").click(function(){
	var tweet = $('#feld').val();

	var tweetId = tweet.match(/\w+$/g)

	var tweetUser = tweet.match(/\w+$/g)

	var tweetUser = tweet.match(".com/(.*)/status");



	alert('ID:  ' + tweetId + '            USER:  ' + tweetUser[1]);
})



