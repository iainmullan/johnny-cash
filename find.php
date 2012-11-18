<?php
ini_set('display_errors', 1);


function db_read($name) {
	if (!is_file($name.'.json')) { return array(); }
	$db = json_decode(file_get_contents($name.'.json'), true);
	return $db;
}

function db_write($name, $data) {
	$fh = fopen($name.'.json', 'w');
	fwrite($fh, json_encode($data));
	fclose($fh);
}


$source = file('places.txt');

$notfound = array_keys($source);
$notfound = array_combine($notfound, $notfound);

$db = db_read('america');

foreach($source as $order => $p) {

	if (!isset($db[$order])) {
		$p = trim($p);

		$params = http_build_query(array(
			'sensor' => 'false',
			'address' => $p
		));
		$url = "http://maps.googleapis.com/maps/api/geocode/json?".$params;
		$results = json_decode(file_get_contents($url),true);

		//$proper = $results['results'][0]['formatted_address'];
		$count = count($results['results']);

		if ($count > 0) {
			$db[$order] = array(
				'name' => $p,
				'full_name' => $results['results'][0]['formatted_address'],
				'lat' => $results['results'][0]['geometry']['location']['lat'],
				'lng' => $results['results'][0]['geometry']['location']['lng']
			);

			print_r($db[$order]);

		} else {
			echo "No results for $p \n";
		}

	} else {
//		echo "Already found $p \n";
	}

}

ksort($db);

db_write('america', $db);
