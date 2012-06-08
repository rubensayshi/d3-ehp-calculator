<?php

// build versioned_index.html

$dir = dirname(__FILE__);

if (!file_exists("{$dir}/index.html")) {
    exit(1);
}

$index = file_get_contents("{$dir}/index.html");
$index = str_replace('src="js/vendor/', 'src="http://d3ehp-cdn.rubensayshi.com/r' . time() . '/js/vendor/', $index);

file_put_contents("{$dir}/versioned_index.html", $index);

?>