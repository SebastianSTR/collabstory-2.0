var treeData = [];

function initializeTree() {
  var treeDataneu = [];
  var data = JSON.parse(localStorage.getItem('tweetdata'));

  var dataMap = data.reduce(function(map, node) {
   map[node.name] = node;
   return map;
  }, {});


  data.forEach(function(node) {
   // add to parent
   var parent = dataMap[node.parent];
   if (parent) {
    // create child array if it doesn't exist
    (parent.children || (parent.children = []))
     // add node to child array
     .push(node);
   } else {
    // parent is null or missing
    treeData.push(node);
   }
  });
};




function drawtree() {

  // var treewrapperwidth = $("#treewrapper").width()-200;
  // var treewrapperheight = $("#treewrapper").height()-200;

  //hier kann man den Tree stylen
  var margin, margintop, windowwidth, windowheight, nodesize, nodecolor, linecolor, linkfill, strokewidth, animDuration, tweetid;
  width = window.innerWidth/2 - (window.innerWidth*.040);//treewrapperwidth; 
  height = window.innerHeight- (window.innerWidth*.10);//treewrapperwidth; //Header abziehen

  if (window.innerWidth<700){
   height = height - 160;
    margin = 65;
  }else{
      height = height - 60;
       margin = 20;
  }


 
 
  margintop = 50;



  // if ($(window).width()>1000){
  //     nodesize = 3;
  // }

  //   else if ($(window).width()>850){
  //   nodesize = 3;
  //   }

  //   else{
  //     nodesize = 3;
  //   }

  nodecolor = "#3D444C";
  linecolor = "#3D444C";
  linkfill = "none";
  strokewidth = "1px";
  animDuration = 300;  //no influence yet
  tweetid = 0 ;

  //globale Variablen
  originalNodeColor = nodecolor;
  highlightNodeColor = "#E62F4A";

  var i = 0;
  var tree = d3.layout.tree().size([width, height]);
  var diagonal = d3.svg.diagonal().projection(function(d) { return[d.x, d.y]; });
  var svg = d3.select("#treewrapper").append("svg").attr("id", "tree")
   .attr("height", height)// + margin + margin
   .attr("width", width)
   .append("g")
   .attr("transform", "translate(" + margin + "," + margintop + ")");

  root = treeData[0];
  update(root);

  function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
     links = tree.links(nodes);
     // console.log(nodes.length);

    var anzahldernodes = nodes.length;

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].leaf = typeof nodes[i].children === "undefined";
    };



     var node_count = nodes.length;

     nodesize = window.innerWidth/3 / node_count;

    if(nodesize>15) nodesize = 15;
    if(nodesize<3) nodesize = 3;

    // Declare the nodes
    var node = svg.selectAll("g.node")
     .data(nodes, function(d) { return d.id || (d.id = ++i); });
     // Enter the nodes. Dise infos bekommt jeder node
      var nodeEnter = node.enter().append("g")
     .attr("class", function(d) { return "node " + ((this.__data__.leaf) ? 'is-leaf':'is-inbetween'); })
     .attr("fill", nodecolor)
     .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });
    

    nodeEnter.append("circle")
     .attr("r", nodesize);

     //Infos die nur letzte Nodes bekommen

        //         if (obj.__data__.children === undefined) {
        //   $(this).addClass("letzterNode");
        // };


    // Declare the links¦
    var link = svg.selectAll("path.link")
     .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
     .attr("class", "linkcolor")
     .attr("fill", linkfill)
     .attr("stroke", linecolor)
     .attr("stroke-width", strokewidth)
     .attr("d", diagonal);
  }

  }

  //////////Push Story text + Color Nodes////////////
replyID = 0;

    //Clean TweetText als globale Funktion//
      var cleanTweetText = function(text) {
            var mentionsRegex = /((@[a-z0-9|_]* ?)*)*/i;
            var linebreaksRegex = /(\r\n|\n|\r)/gm;
            var hashtagRegex = /#[a-z|-]*/ig;
            var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi; 
            return text.replace(mentionsRegex, '').replace(linebreaksRegex, '').replace(hashtagRegex, '').replace(urlRegex, '').replace('  ', ' ').trim();
          };
  //////////Push Story text + Color Nodes////////////
  var already_read_tweets = [];

  $("body").on("click",".node",function(){
       // if (window.innerWidth<700) $('#treewrapper:visible').slideUp();
    var replyID = ($(this)[0].__data__.name);
    //clear colors of all nodes//
    $('.node').each(function(i, obj) {
      $(this).attr("fill", originalNodeColor);
    });
    //highlight path//
    function highlightPath(startId, firstRun) {
      var node;
      $('.node').each(function(i, obj) {
        if(startId.toString() == obj.__data__.name) {
          node = $(obj)[0];
          if (firstRun) activeNode = i;
        }
      });
      //path einfärben//
      $(node).attr("fill", highlightNodeColor);
      if (node.__data__.parent && node.__data__.parent.name) {
        highlightPath(node.__data__.parent.name, false);
      }
    }
    
    highlightPath($(this)[0].__data__.name, true);
      //Push Content to Textfeld//
    var cleanTweetText = function(text) {
      var mentionsRegex = /((@[a-z0-9|_]* ?)*)*/i;
      var linebreaksRegex = /(\r\n|\n|\r)/gm;
      var hashtagRegex = /#[a-z|-]*/ig;
      var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi; 
      return text.replace(mentionsRegex, '').replace(linebreaksRegex, '').replace(hashtagRegex, '').replace(urlRegex, '').replace('  ', ' ').trim();
    };

    var buildStory = function(startId) {
      if (!startId || startId === "null") return '';

      startId = startId.toString();

      var findTweet = function(startId) {
        for(var i=0; i<allTweets.length; i++) {
          if (allTweets[i].name == startId)
            return allTweets[i];
        }
      };

      var tweet = findTweet(startId);        
      if (tweet.parent === null) return ' '
      var readClass = (localStorage['read_tweets'] && localStorage['read_tweets'].indexOf(tweet.name) > -1) ? 'has-been-read' : '';
      already_read_tweets.push(tweet.name);

      return (buildStory(tweet.parent) + ' ' + '<span data-textusername = '+tweet.username+' data-textuseravatarlink = '+tweet.useravatarlink+' class="' + readClass + '" data-id='+tweet.name+'>' + cleanTweetText(tweet.text)).trim() + '</span>';


    };
    // APPEND STORY
    $(".storytext p").html(buildStory($(this)[0].__data__.name));
    $(".replylink").delay(600).fadeIn('slow');


    
    localStorage['read_tweets'] = JSON.stringify(already_read_tweets); 

    // APPEND REPLY BUTTON CONTINUE
    $("a.replylink").each(function() {
       $(this).attr("href", 'https://twitter.com/intent/tweet?in_reply_to='+replyID);
       replyID = 0;
    });
});

//Von wem ist der Tweet on hover
$("body").on("mouseover",".node",function(){
  // var posx = this.__data__.x;
  // var posy = this.__data__.y;
  // $("#tooltip").css({"left":posx});
  // $("#tooltip").css({"top":posy});
  $("#tooltip ").css({"display":"block"});
  $("#tooltip p").html("@" + this.__data__.username);
  var srclink = this.__data__.useravatarlink;
  $("#tooltip").append('<img src='+srclink+'/>');
});
//On Mouseout Node natuerlich wieder rueckgaengig
$("body").on("mouseout",".node",function(){
  $("#tooltip").find("img").remove();
   $("#tooltip p").html("");
});


var old_name;
//Von wem ist der Text on hover
$("body").on("mouseover","span",function(){

  if(old_name!=$(this).data("textusername")){
    $(".spanisactive").removeClass('spanisactive');
    $(this).addClass("spanisactive")
  }

  $(this).addClass("spanisactive")
  $("#tooltip p").html("@" + $(this).data("textusername"));
  var srclink = $(this).data("textuseravatarlink");
  $("#tooltip").append('<img src='+srclink+'/>');

  old_name = $(this).data("textusername");

});



//On Mouseout Text natuerlich wieder rueckgaengig
$("body").on("mouseleave",".storytext p",function(){
  $("#tooltip").find("img").remove();
   $("#tooltip p").html("");
   $(".spanisactive").removeClass('spanisactive');
});

//On Mouseout Text natuerlich wieder rueckgaengig
$("body").on("mouseout",".storytext p",function(){
  $("#tooltip").find("img").remove();
   $("#tooltip p").html("");

});