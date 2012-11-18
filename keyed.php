<?php
$json = file_get_contents('america.json');
$places = json_decode($json, true);

$indexed = array();

foreach($places as $place) {
	$indexed[$place['name']] = $place;
}

echo json_encode($indexed);
?>