
$(document).ready(function () {

    getAllAircrafts();
    getAllFlights();
    getAllAirports();

    $('#dateForNewFlight').datetimepicker({
        format: "DD/MM/YYYY HH:mm",
        locale: "tr"
    });

    // Add Aircraft
    $('#btnSaveAC').click(function () {
        const data = {
            NickName: $("#nickname").val(),
            Camera: $("#Camera option:selected").text(),
            CameraModel: $("#cameraModel option:selected").text()
        }
        addAirCraft(data);
    });

    // Add Flight review
    $('#bookReservation').click(function () {
        var dt = $('#dateForNewFlight').val();
        var aircraftId = $('#chooseAircraft').val();

        if (dt && aircraftId != -1 && drawnShapesCoordinates) {
            //TODO: Check Violations, if there are show them on modal
            const data = {
                type: typeOfShape,
                coordinates: drawnShapesCoordinates
            };
            checkIntersection(data, fillViolationsOnModal);
            $('#makeReservationModal').modal('show');
        }
        else {
            alertify.error("Please fill all the fields!");
        }
    });

    // Add Flight
    $('#btnSaveReservation').click(function () {
        if (!flagForFlightViolation && !flagForAirportViolation) {
            const geo = {
                Type: typeOfShape,
                Coords: drawnShapesCoordinates
            }
            const flight = {
                AircraftId: $("#chooseAircraft").val(),
                Altitude: $('#altitudeRange').val(),
                Date: $('#dateForNewFlight').val(),
                Duration: $("#durationRange").val(),
                Geo: geo
            }
            addFlight(flight);
        }
        else {
            alertify.alert("Warning!", " Because of Violations, reservation couldn't save. Please consider and fix them!");
        }
    });
});



var flagForFlightViolation;
var flagForAirportViolation;
var drawingManager;
var map;
var infoWindow;

var CamerasAndModel = {};
CamerasAndModel['GoPro'] = [' ', 'Karma'];
CamerasAndModel['Hubsan'] = [' ', 'H501S', 'H501SS', 'X4']

let drawnShapesCoordinates;
let typeOfShape = "";
var shape;

/****************************** * */

function CreateRemoveControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginRight = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to remove drawn shape';
    controlDiv.appendChild(controlUI);

    var controlImg = document.createElement('img');
    controlImg.src = "www/extra/trash.png"
    controlImg.style.width = "40px";
    controlUI.appendChild(controlImg);

    // Setup the click event listeners: remove drawn shape and show draw control
    controlUI.addEventListener('click', function () {

        shape.overlay.setMap(null);
        changeVisibilityOfDrawingModes(0);
        drawnShapesCoordinates = null;
    });

}
/** GOOGLE MAP */
function initMap() {

    var options = {
        zoom: 9,
        center: { lat: 41.008298, lng: 28.978358 }
    }

    map = new google.maps.Map(document.getElementById('map'), options);
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT,
            drawingModes: ['polygon', 'polyline']
        },
        polylineOptions: {
            clickable: true,
            draggable: false,
            editable: false
        },
        polygonOptions: {
            clickable: true,
            draggable: false,
            editable: false
        }
    });

    infoWindow = new google.maps.InfoWindow({
        //content: "deneme content",
        size: new google.maps.Size(150, 50)
    });

    /**** Remove Control */
    var removeControlDiv = document.createElement('div');
    var removeControl = new CreateRemoveControl(removeControlDiv, map);

    removeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(removeControlDiv);
    /**** Remove Control End */

    /** Shapes complete event */
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        if (e.type == 'polygon' || e.type == 'polyline') {
            var arrCoord = getDrawnShapesCoordinates(e.overlay);
            // if shape is polygon, add last point and set it to first point coordinate
            if (e.type == 'polygon') {
                drawnShapesCoordinates = [];
                drawnShapesCoordinates.push(arrCoord);
                var len = drawnShapesCoordinates[0].length;
                drawnShapesCoordinates[0][len] = drawnShapesCoordinates[0][0];
                typeOfShape = "Polygon";
            }
            else {
                drawnShapesCoordinates = arrCoord;
                typeOfShape = "LineString";
            }
            changeVisibilityOfDrawingModes(1);
            shape = e;

        }
        else {
            console.log("Error! type of event is undefined");
            drawnShapesCoordinates = null;
            shape = null;
        }
    });

    drawingManager.setMap(map);
    /** Shapes complete event end*/

}
/** GOOGLE MAP BİTİŞ */

function getDrawnShapesCoordinates(shape) {

    var tempCoord = [];
    var v = shape.getPath();
    var len = v.getLength();
    for (var i = 0; i < len; i++) {
        var xy = v.getAt(i);
        tempCoord[i] = [xy.lng(), xy.lat()];
    }
    return tempCoord;
}

function chooseAircraft(elem) {
    if (elem.selectedIndex == (elem.length - 1)) {
        $('#AddAirModal').modal('show');
    }
}

/*
 * Aircrafts
 */
function getAllAircrafts() {
    getAllAirCraftsRequestToApi()
        .done(function (data) {

            $('#chooseAircraft').empty(); // Firstly, clear items

            $('#chooseAircraft').append($('<option>', {
                value: "-1",
                text: "Select a Aircraft",
                disabled: true
            }));
            $.each(data, function (index, value) {
                $('#chooseAircraft').append($('<option>', {
                    value: value.Id,
                    text: value.NickName
                }));
            });
            $('#chooseAircraft').append($('<option>', {
                value: "-1",
                text: "Add a new Aircraft"
            }));
        });
}

function addAirCraft(airCraft) {

    addAirCraftRequestToApi(airCraft)
        .done(function (data) {
            getAllAircrafts();
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            alertify.error("There is something wrong! Please try again!");
        });
}
/*
 * Aircrafts End
 */

/**
 * Flights
 */

function addFlight(flight) {
    addFlightRequestToApi(flight)
        .done(function (data) {
            shape.overlay.setMap(null);
            getAllFlights();
            alertify.success("Successfully added new Flight!");
        }).fail(function (jqXhr, textStatus) {
            alertify.error(jqXhr.responseText + " -- " + textStatus.text);
            console.log(jqXhr.responseText);
        });

}

function getAllFlights() {
    getAllFlightsRequestToApi()
        .done(function (data) {
            for (var i = 0; i < data.length; i++) {
                var type = data[i].Geo.type;
                var content = {
                    isAirport: 0,
                    info: data[i].Aircraft.NickName + "<br /><br />" + data[i].Aircraft.Camera + " / " + data[i].Aircraft.CameraModel,
                    isWillZoom: 0
                };

                if (type == "Polygon")
                    createPolygonOnMap(data[i], content, map);
                else if (type == "LineString")
                    createPolylineOnMap(data[i], content, map);
            }

        }).fail(function (jqxhr, textStatus) {
            console.log(jqxhr.responseText);
            alertify.error("There is something wrong!");
        });
}

function checkIntersection(shapeData, callback) {

    checkIntersectionRequestToApi(shapeData)
        .done(function (data) {
            const flightLen = data.FlightList.length;
            const airportLen = data.AirportList.length;
            if (flightLen || airportLen) {
                alertify.error("There is Conflict! Please change your Aircraft's route!");
                if (flightLen) {
                    flagForFlightViolation = 1;
                    callback(data, " You have intersection with Flights!");
                }
                if (airportLen) {
                    flagForAirportViolation = 1;
                    callback(data, " You have intersection with Airports!");
                }
            } else {
                flagForAirportViolation = 0;
                flagForFlightViolation = 0;
                callback(data, "Congrats, You don't have any Violation!");
                alertify.success("Congrats, This route is OK!");
            }
        }).fail(function (jqXhr, textStatus) {
            console.log(jqXhr.responseText);
        });
}
/**
 * Flights End
 */

function fillViolationsOnModal(data, message) {
    $("#listOfViolations")
        .append('<div class="row">' +
            '<li><i class="fa fa-circle"> ' + message +
            '</i></li>' +
            '</div>');

}


function changeCameraList() {

    var cameraList = document.getElementById("Camera");
    var modelList = document.getElementById("cameraModel");
    var selCamera = cameraList.options[cameraList.selectedIndex];


    while (modelList.options.length) {
        modelList.remove(0);
    }
    var Cameras = CamerasAndModel[selCamera.label];

    if (Cameras) {

        var i;
        for (i = 0; i < Cameras.length; i++) {
            var camera = new Option(Cameras[i], i);
            modelList.options.add(camera);

        }
    }
}

function changeVisibilityOfDrawingModes(isVisible) {

    drawingManager.setOptions({
        drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT,
            drawingModes: isVisible ? [] : ['polygon', 'polyline']
        }
    });
}

/*
 * Airports
 */
function getAllAirports() {
    getAllAirportsRequestToApi()
        .done(function (data) {
            var len = data.length
            for (var i = 0; i < len; i++) {
                var content = {
                    isAirport: 1,
                    info: data[i].Name,
                    isWillZoom:0
                };
                createPolygonOnMap(data[i], content, map);
            }
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
        });
}
/*
 * Airports End
 */

$('#makeReservationModal').on('hidden.bs.modal', function (e) {
    $("#listOfViolations").empty();
})

/** Vue.js Başlangıç */
var vueAlt = new Vue({
    el: '#altitude',
    data: {
        value: 20
    },
    computed: {
        ft: function () {
            return this.value + " ft";
        }
    }

});

var vueDurat = new Vue({
    el: '#duration',
    data: {
        value: 15
    },
    computed: {
        min: function () {
            let hour = parseInt(this.value / 60);
            let minute = this.value % 60;
            return hour + " hr, " + minute + " min";
        }
    }


});
/** Vue.js Bitiş */



/**
 *  ****** bir noktanın belli bir uzaklıktaki noktanın koordinatını bulma (açıya göre) ******
 *  brng = radian cinsinden açı değeri.
 *  lng = merkez noktanın Longitude'ı
 *  lat = merkez noktanın Latitude'sı
 */

function getCoords() {
    var numberOfPointsWeWant = 24;
    var arr = [];
    var lng = 29.23131313123; // merkez noktanın longitude'ı
    var lat = 35.12313131313; // merkez noktanın latitude'sı
    for (var i = 1; i <= numberOfPointsWeWant; i++) {
        // 360'ı kaç nokta istiyorsak ona bölüyoruz ve sırasıyla gitmesi için ise her defasında açı kadar artırıyoruz.
        // Fonksiyonumuz radian cinsinden açı aldığı için, gönderirken açımızı radiana çeviriyoruz.
        var brng = degrees_to_radians(i * (360 / numberOfPointsWeWant)); 
        arr[i - 1] = findCoordinates(brng, lng, lat);
    }

    // elimizde noktaların array'i mevcut. İstediğimizi yapabiliriz bununla.
    console.log(arr);
}

function findCoordinates(brng, lng, lat) {

    const R = 6378.1; // sabit değer
    const d = 5; // kilometre cinsinden uzaklık (merkez noktadan 5 km uzaklıgındaki koordinatları bulacağız)

    const lat1 = degrees_to_radians(lat);
    const lon1 = degrees_to_radians(lng);

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));

    const finalLat = radians_to_degrees(lat2);
    const finalLng = radians_to_degrees(lon2);

    return [finalLng, finalLat];

}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
