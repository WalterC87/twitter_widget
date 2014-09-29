<?php
define("BASE_URL", "/");
define("ROOT_PATH", $_SERVER["DOCUMENT_ROOT"]. "/");

$myarray = array("TweetsTemplate"=> file_get_contents(ROOT_PATH . "/assets/templates/widget_template.html", true));

print (json_encode(file_get_contents(ROOT_PATH ."assets/templates/widget_template.html",true)));

//echo json_encode($myarray,JSON_UNESCAPED_SLASHES);

?>