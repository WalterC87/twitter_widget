var jqueryDetect = dependencyStatus('jquery');

var statics = [
	"//code.jquery.com/jquery-1.11.0.min.js",
	"//twitterapp.dev/assets/js/mustache.min.js",
	"//twitterapp.dev/assets/css/widget_twitter.css"
];

function loadStatics(filename, onload) {
	var itemGetExt = filename.split(".");
	var itemExt = itemGetExt[itemGetExt.length - 1];
	var head = document.getElementsByTagName('head')[0];
	var staticFile = '';
	
	if(itemExt === "js"){
		staticFile = document.createElement('script');
		staticFile.type = "text/javascript";
		staticFile.src = filename;
		
		if (typeof staticFile != "undefined"){
			staticFile.onload = staticFile.onreadystatechange = function () {
				if(staticFile.readyState) {
					if(staticFile.readyState === 'complete' || staticFile.readyState === 'loaded') {
						staticFile.onreadystatechange = null;
						onload();
					}
				}else{
					onload();	
				};
			};
			
			head.appendChild(staticFile);
		};
	}else{
		staticFile = document.createElement('link');
		staticFile.rel = "stylesheet";
		staticFile.type = "text/css";
		staticFile.href = filename;
		
		if (typeof staticFile != "undefined") {
			head.appendChild(staticFile);
		};
	};
}

function dependencyStatus(fileName) {
	var fileNameSplit=fileName.split("/");
	var itemToSearch=fileNameSplit[(fileNameSplit.length - 1)];
	itemToSearch=itemToSearch.replace(".js","");
	var dependencyList=document.getElementsByTagName("script");
	var dependencyResult=0;
	for(var i=0; i<dependencyList.length; i++) {
	dependencyResult=dependencyList[i].src.indexOf(itemToSearch);                                                
		if (dependencyResult>0){
			break;
		};                                
	};

	return dependencyResult;
	
}

function getInternetExplorerVersion(){
	var rv = -1;
	
	if (navigator.appName == 'Microsoft Internet Explorer'){
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		
		if (re.exec(ua) != null){
	  		rv = parseFloat( RegExp.$1 );
		}
	}
	else if (navigator.appName == 'Netscape'){
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null){
	  		rv = parseFloat( RegExp.$1 );
		}
	}
	return rv;
}

;(function() {
	var Tweet = function(){
		if(!(this instanceof Tweet)){
			return new Tweet();	
		}
	};
	
	window.Tweet = Tweet;
})();

Tweet.prototype.init = function(options){
	var params = {
		screen_name: options.screen_name != undefined ? options.screen_name : 'treehouse',
		display_count: options.display_count != undefined ? options.display_count : 15,
		display_result: options.display_result
	}
	
	function showTweets(container,TweetsTemplate){
		var width = 0;
		width = $(container).width;
		var loaderImg = '<div class="loading"><div class="spinner" style="width:200px; height:60px; margin-left:' + (width-200)/2+ 'px;"><p class="text-loading">Loading tweets</p><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>';
		$(loaderImg).width(width);	
		$(loaderImg).insertBefore(container);
		$('.loading').css('margin-left',(width-200)/2+'px');
		$(container).css('visibility','hidden');
		
		$.ajax({
			url: 'http://twitterapp.dev/server.php?screen_name=' + params.screen_name + '&count=' + params.display_count,
			error: function(data){
				$(container).html('Ajax request failed');
			}
		})
		
		.done(function (data){
			var objData = JSON.parse(data);

			$(TweetsTemplate).appendTo(container);
			var lstn = $(container).children()[0];
			var lst_cont = lstn.children[1];
						
			if(objData.Tweets.length > 0){
				for(var i = 0; i < objData.Tweets.length - 1; i++){
					$(lst_cont).html(objData.Tweets);
				}
			}
		})
		
		setTimeout(function(){
			$(".loading").remove();
			
			$(container).find('.widget-container').each(function(){
				$(container).html(function(i,val) {return val.replace('{{screen_name}}', params.screen_name) });
			});
							 
			$(container).css('visibility','visible');
			
		}, 1500);
	}
	
	function App(){
		$.ajax({
			type: 'GET',
			url: 'http://twitterapp.dev/server_template.php'
		})
		
		.error(function (err){
		  console.log(JSON.stringify(err.responseText));
		})
		
		.done(function (data){
			var objTemplate = JSON.parse(data);
			//console.log(objTemplate.TweetsTemplate);
			$('.widget-container').remove();
			showTweets(params.display_result, objTemplate.TweetsTemplate);
		})
		
	}
	
	var getIE=getInternetExplorerVersion();

	if ((getIE>0)&&(getIE<9)){
	  loadStatics("https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js", function() {});
	  loadStatics("https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js", function() {});
	};
	
	if (jqueryDetect<0){
		loadStatics(statics[0], function(){
			jqueryDetect=1;
		  	for(var x = 1; x < statics.length; x++){
				loadStatics(statics[x],function(){});
		  	};  
		  	App();
		})//end jquery load
	}else{
		for(var x = 1; x < statics.length; x++){
			loadStatics(statics[x],function(){});
		};  
		App();
	}
	
	//reload the tweets each ten minutes
	
	setInterval(function(){
		App();
	},600000)();
	
};



