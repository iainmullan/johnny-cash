
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function log(s){console.log(s)}

$(document).ready(function() {

    if ($.browser.mozilla || $.browser.msie) { alert("Using IE or Firefox? Johnny prefers Chrome or Safari (for now) (sorry!)");}

    var track;
    var lastPin = false;

    function jc_update(timeupdate) {

        var t = timeupdate.currentTarget.currentTime;

        var pct = (t / timeupdate.currentTarget.duration) * 100;
        pct = parseInt(pct);
        $('#progress').css('width', pct+'%');

        var newLyric = MM.getNextLyric(t*1000);
        if (newLyric) {
            $('#subtitle').html(newLyric.lyric);

            $('#subtitle').removeClass('place-lyric');

            if (MM.places[newLyric.lyric]) {

                $('#subtitle').addClass('place-lyric');

                var place = MM.places[newLyric.lyric];

                latLng = new google.maps.LatLng(place.lat, place.lng);

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title:place.name,
                    icon: 'face-small.png'
                });

                if (lastPin) {

                    var lat1 = lastPin.position.lat();
                    var lon1 = lastPin.position.lng();
                    var lat2 = marker.position.lat();
                    var lon2 = marker.position.lng();

                    var R = 6371; // km
                    var dLat = (lat2-lat1).toRad();
                    var dLon = (lon2-lon1).toRad();
                    var lat1 = lat1.toRad();
                    var lat2 = lat2.toRad();

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;

                    d = parseInt(d);

                    MM.distance = MM.distance + d;
                    $('#distance-num').html(MM.distance);
                }

                lastPin = marker;
                map.panTo(latLng);
            }
        }

    }

    function load_html_audio() {

        track = new Audio("jc.mp3");

        $('#controls').show();

        $(track).bind('timeupdate', function(timeupdate) {
            jc_update(timeupdate);
        });

        $(track).bind('canplay', function(timeupdate) {
            track.play();
        });

    }

    function load_tomahk_audio() {

        track = window.tomahkAPI.Track("I've Been Everywhere","Johnny Cash", {
            resolvers: ['exfm'],
            width: 300,
            height: 300,
            handlers: {
                onloaded: function() {
                },
                onended: function() {
                    $('#finger').show();
                },
                onplayable: function() {
                    $('#controls').show();
                    track.play();
                },
                onresolved: function(resolver, result) {
                },
                ontimeupdate: function(timeupdate) {
                    jc_update(timeupdate);
                }
            }

        });

        $('#player').html(track.render());
    }

    $('#load').click(function() {
        loadTrack(MM);//.play();
    });
    $('#play').click(function() {
        track.play();
    });
    $('#skip').click(function() {
        track.currentTime = 45;
    });
    $('#end').click(function() {
        track.currentTime = 150;
    });

    $('#pause').click(function() {
        track.pause();
    });

    MM.track.subtitle("b930f210-5172-4f9b-836f-0805f69a7978", function(data) {
        MM.lyrics = data;
        load_html_audio();
    });

});

var map;
function initialize() {
    var myOptions = {
        zoom: 5,
        center: new google.maps.LatLng(38.856,-90.628),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), myOptions);

    $.getJSON('america_keyed.json', function(data) {
        MM.places = data;
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
