<?php

$dir = dirname(__FILE__);

if (!file_exists("{$dir}/index.html")) {
    exit(1);
}

$index = file_get_contents("{$dir}/index.html");
$index = str_replace('src="js/', 'src="http://d3ehp-cdn.rubensayshi.com/r' . time() . '/js/', $index);
$index = str_replace('href="css/', 'href="http://d3ehp-cdn.rubensayshi.com/r' . time() . '/css/', $index);

file_put_contents("{$dir}/versioned_index.html", $index);

?>