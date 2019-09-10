function createPolygonOnMap(polygonData, content, map) {
    var coordinatesJSON = coordArrayToCoordJSON(polygonData.Geo.coordinates[0]);
    var polygon = new google.maps.Polygon({
        paths: coordinatesJSON,
        strokeColor: '#49430c',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#49430c',
        fillOpacity: 0.35
    });


    if (content.isAirport) { // if it is 1, polygon is airport
        //set the different color for airport
        polygon.setOptions({
            strokeColor: '#FF3333',
            fillColor: '#FF3333'
        });
    }

    if (content.isWillZoom) {
        map.setOptions({
            zoom: 10,
            center: { lat: coordinatesJSON[0].lat, lng: coordinatesJSON[0].lng }
        });
    }

    //add click event and set infoWindow
    polygon.addListener('click', function (e) {
        infoWindow.setContent(content.info);
        infoWindow.setPosition(e.latLng);
        infoWindow.open(map);
    });

    // zoom to shape
    polygon.setMap(map);
    return polygon;
}

function createPolylineOnMap(polylineData, content, map) {
    var coordinatesJSON = coordArrayToCoordJSON(polylineData.Geo.coordinates);
    var polyline = new google.maps.Polyline({
        path: coordinatesJSON,
        geodesic: true,
        strokeColor: '#49430c',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.addListener('click', function (e) {
        infoWindow.setContent(content.info);
        infoWindow.setPosition(e.latLng);
        infoWindow.open(map);
    });

    // zoom to shape
    if (content.isWillZoom) {
        map.setOptions({
            zoom: 10,
            center: { lat: coordinatesJSON[0].lat, lng: coordinatesJSON[0].lng }
        });
    }

    polyline.setMap(map);
    return polyline;
}

function coordArrayToCoordJSON(coordsArray) {
    var jsonCoords = [];
    var len = coordsArray.length;

    for (var i = 0; i < len; i++) {
        var lat = coordsArray[i][1];
        var lng = coordsArray[i][0];
        jsonCoords[i] = {
            "lat": lat,
            "lng": lng
        };
    }
    return jsonCoords;
}
