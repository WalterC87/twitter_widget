<?php
$myarray = array("TweetsTemplate"=> file_get_contents("assets/templates/widget_template.html"));

echo json_encode($myarray,JSON_UNESCAPED_SLASHES);

?>