function loadTweets(forceFetch) {
  allTweets = [];
  if (forceFetch) {
    fetchOverNetwork();
  } else {
    var tweetData = fetchFromLocalStorage();
    if (tweetData) {
      allTweets = tweetData.slice();
      var event = new Event('doneLoadingTweets');
      document.body.dispatchEvent(event);
    } else {
      fetchOverNetwork();
    }
  }
  
  function fetchFromLocalStorage() {
    var data = JSON.parse(localStorage.getItem('tweetdata'));
    return data;
  }

  function fetchOverNetwork() {
    var LoadingIndicator, TweetLoader, loadingIndicator, tweetLoader, wrap,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    wrap = function(text, width) {
      var dy, line, lineHeight, lineNumber, tspan, word, words, _results;
      words = text.text().split(/\s+/).reverse();
      line = [];
      lineNumber = 0;
      lineHeight = 1.1;
      dy = 1.1;
      tspan = text.text(null).append("tspan").attr("dy", dy + "em");
      _results = [];
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          _results.push(tspan = text.append("tspan").attr("x", '0px').attr("dy", dy + 'em').text(word));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LoadingIndicator = (function() {
      LoadingIndicator.prototype.element = null;

      function LoadingIndicator(element) {
        this.done = __bind(this.done, this);
        this.updateProgress = __bind(this.updateProgress, this);
        this.element = $(element).append('p').css('position', 'absolute').css('bottom', '20px').css('right', '20px').css('color', '#ddd');
      }

      LoadingIndicator.prototype.updateProgress = function(num, denom) {
        return this.element.text("Loading (" + num + "/" + denom + ")");
      };

      LoadingIndicator.prototype.done = function() {
        return this.element.remove();
      };

      return LoadingIndicator;

    })();

    TweetLoader = (function() {
      function TweetLoader() {
        this.processConversation = __bind(this.processConversation, this);
        this.getTweetTree = __bind(this.getTweetTree, this);
        this.testTweet = __bind(this.testTweet, this);
      }

      TweetLoader.prototype.tweetCallback = null;

      TweetLoader.prototype.doneCallback = null;

      TweetLoader.prototype.statusCallback = null;

      TweetLoader.prototype.progNum = 0;

      TweetLoader.prototype.progDenom = 1;

      TweetLoader.prototype.testTweet = function() {
        return true;
      };

      TweetLoader.prototype.getTweetTree = function() {
        var tweetDiv;
        tweetDiv = d3.select('.permalink-tweet');
        this.tweetQueue = [];
        return this.getConversation(rootUser, rootTweetId);
      };

      TweetLoader.prototype.collectTweet = function(tweet) {
        var tweetCondensed = {};
        tweetCondensed.name = tweet.id;
        tweetCondensed.text = tweet.content;
        tweetCondensed.accountname = tweet.name;
        tweetCondensed.username = tweet.user;
        tweetCondensed.useravatarlink = tweet.avatar;
        tweetCondensed.parent = tweet.parent || null;
        allTweets.push(tweetCondensed);
      };

      TweetLoader.prototype.processConversation = function() {
        var tweet, tweetId, url, user;
        tweet = this.tweetQueue.shift();
        if (tweet != null) {
          tweetId = tweet[0], user = tweet[1];
          url = "http://hustleblood.de/collabstory/api/api.php?user=" + user + "&tweetId=" + tweetId;
          return d3.json(url).get((function(_this) {
            return function(error, data) {
              var doc, parentDiv, parser, tweetDiv;
              parser = new window.DOMParser();
              doc = parser.parseFromString(data.page, 'text/html');
              doc = d3.select(doc);
              tweet = {};
              parentDiv = doc.select('#ancestors li:last-child div.simple-tweet');
              if (!parentDiv.empty()) {
                tweet.parent = parentDiv.attr('data-tweet-id');
              }
              tweetDiv = doc.select('.permalink-tweet');
              tweet.id = tweetDiv.attr('data-tweet-id');
              tweet.user = tweetDiv.attr('data-screen-name');
              tweet.content = tweetDiv.select('.tweet-text').text();
              tweet.avatar = tweetDiv.select('.avatar').attr('src');
              tweet.name = tweetDiv.attr('data-name');
              tweet.time = parseInt(tweetDiv.select('._timestamp').attr('data-time'));
              tweet.url = "http://twitter.com/" + tweet.user + "/status/" + tweet.id;

              _this.collectTweet(tweet);

              _this.progNum++;
              _this.statusCallback(_this.progNum, _this.progDenom);
              return _this.processConversation();
            };
          })(this));
        } else {
          
          localStorage.setItem('tweetdata', JSON.stringify(allTweets));
          var event = new Event('doneLoadingTweets');
          document.body.dispatchEvent(event);
          return this.doneCallback();
        }
      };

      TweetLoader.prototype.getMoreConversation = function(user, tweetId, max_position) {
        var url;
        url = "http://hustleblood.de/collabstory/api/api.php?user=" + user + "&tweetId=" + tweetId + "&action=conversation&max_position=" + max_position;
        return d3.json(url).get((function(_this) {
          return function(error, data) {
            var doc, i, parser, tweetQueue;
            parser = new window.DOMParser();
            doc = parser.parseFromString(data.descendants.items_html, 'text/html');
            tweetQueue = _this.tweetQueue;
            i = 0;
            d3.select(doc).selectAll('.simple-tweet').each(function() {
              var replyDiv, replyId, replyUser;
              replyDiv = d3.select(this);
              replyId = replyDiv.attr('data-tweet-id');
              replyUser = replyDiv.attr('data-screen-name');
              tweetQueue.push([replyId, replyUser]);
              max_position = replyId;
              return i++;
            });
            _this.progDenom += i;
            _this.statusCallback(0, _this.progDenom);
            if (data.descendants.has_more_items) {
              return _this.getMoreConversation(user, tweetId, max_position);
            } else {
              return _this.processConversation();
            }
          };
        })(this));
      };

      TweetLoader.prototype.getConversation = function(user, tweetId) {
        this.tweetQueue.push([tweetId, user]);
        return this.getMoreConversation(user, tweetId, 0);
      };

      return TweetLoader;

    })();

    tweetLoader = new TweetLoader();

    if (!tweetLoader.testTweet()) {
      alert('Not on a tweet; Navigate to a tweet and try again');
    } else {
      loadingIndicator = new LoadingIndicator(document.getElementById('loadingIndicator'));
      tweetLoader.statusCallback = loadingIndicator.updateProgress;
      tweetLoader.doneCallback = loadingIndicator.done;
      tweetLoader.getTweetTree();
   
    }

  }

};


