<?php

define("BASE_URL", "/");
define("ROOT_PATH", $_SERVER["DOCUMENT_ROOT"]. "/");

if( isset($_GET["screen_name"]) ){
	$screen_name = $_GET["screen_name"];
}else{
	$screen_name = "treehouse";
}

if( isset($_GET["count"]) ){
	$count = $_GET["count"];
}else{
	$count = 15;
}

require_once (ROOT_PATH . 'app_tokens.php');
require_once (ROOT_PATH . 'tmhOAuth.php');

$connection = new tmhOAuth(array(
	'consumer_key'=> $consumer_key,
	'consumer_secret'=> $consumer_secret,
	'user_token'=> $user_token,
	'user_secret'=> $user_secret
));

$connection->request('GET', $connection->url('1.1/statuses/user_timeline.json'), array('screen_name'=> $screen_name, 'count'=> $count));
$response_code = $connection->response['code'];

if($response_code == 200){
	$tweet_data = json_decode($connection->response['response'], true);
	
	//load the template
	$tweet_template = file_get_contents('assets/templates/tweet_template.html');

	$tweet_list = array();
	
	require_once 'parser.php';
	
	foreach($tweet_data as $tweet){
		
		//Get a fresh copy of the tweet template
		$tweet_html = $tweet_template;
		
		//render the HTML
		
		$obj_tweet = array(
			"id"=> $tweet['id'],
			"created"=> twitter_time($tweet['created_at']),
			"name"=> $tweet['user']['name'],
			"screen_name"=> $tweet['user']['screen_name'],
			"image"=> $tweet['user']['profile_image_url'],
			"text"=> linkify($tweet['text'])
			
		);
		
		$tweet_html = str_replace('{{tweet_id}}', $tweet['id'], $tweet_html);
		$tweet_html = str_replace('{{timestamp}}', twitter_time($tweet['created_at']),$tweet_html);
		$tweet_html = str_replace('{{display_name}}', $tweet['user']['name'],$tweet_html);
		$tweet_html = str_replace('{{screen_name}}', $tweet['user']['screen_name'], $tweet_html);
		$tweet_html = str_replace('{{image_profile}}', $tweet['user']['profile_image_url'],$tweet_html);
		$tweet_html = str_replace('{{display_text}}', linkify($tweet['text']),$tweet_html);
		
		array_push($tweet_list, $tweet_html);
		//$tweet_stream .= $tweet['text'] . '<br/><br/>';	
	}
	
	$my_array = array("Tweets"=> $tweet_list);

	echo json_encode($my_array, JSON_UNESCAPED_SLASHES);
}else{
	if($response_code == 429){
		echo "Error: Twitter API rate limit reached";
	}else{
		echo "Error: Twitter was not able to process that request";
	}
}

?>