<?php
$json = json_decode(file_get_contents('50.json'), true);

foreach($json['response']['list']['listItems']['items'] as $item) {

	if ($item['venue']['beenHere']['marked'] == true) {
		echo $item['venue']['name'].', ';
		echo $item['venue']['location']['address'].', ';
		echo $item['venue']['location']['postalCode'];
		echo "\n";
	}
}

