

var	route = {
	stopped: false,
	places: null,
	placeCounter: 0,
	nextPlace: function() {
		if (!this.stopped) {
			elem = this.places[this.placeCounter++];

			latLng = new google.maps.LatLng(elem.lat, elem.lng);

			marker = new google.maps.Marker({
		        position: latLng,
		        map: map,
		        title:elem.name
		    });

			map.panTo(latLng);

			$('#subtitle').html(elem.name);

			setTimeout('route.nextPlace()', 1000);
		}
	}
}
$(document).ready(function() {

	$('#next').click(function() {
		route.stopped = false;
		route.nextPlace();
	});

	$('#stop').click(function() {
		route.stopped = true;
	});

});
