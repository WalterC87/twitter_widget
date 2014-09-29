twitter_widget
==============

twitter widget Teamtreehouse forum contest.

This Widget was created with JavaScript and PHP using [tmhOAuth.php] (https://github.com/themattharris/tmhOAuth) to get the tweets.

How to use
==============

1. Create a virtual host and a new host, this configuration is in explanation.txt

2. In the page where you wish use this widget, you must create one div, this will be the widget container, this container will be empty

3. In the footer before close body tag you must use this script: <script src="http://twitterapp.dev/widget_twitter.js"></script>. "http://twitterapp.dev" represents the virtual host in your localhost.

4. After put the script you must declare a object like this:
      `<script>`
      	`Tweet().init({`
      		`screen_name: 'WalterC_87',`
      		`display_count: 10,`
      		`display_result: '.container'`
      	`});`
      `</script>`
  
  **screen_name** is your twitter user name.
  **display_count** represents the number of tweets to display.
  **display_result** represents the div that you should have created in the second step, this "container" will be identified with a css class.

5. templates.html it's an example that how to use and implement this widget.

6. This widget twitter works with php 5.3 or higher.


Test and enjoys working, with this widget and let me know your opinion.

**email:** walter@waltercordero.com 
