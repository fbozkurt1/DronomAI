
$(document).ready(function () {

    $("#myAircrafts").click(function () {
        getAllAircraftsToModal();
    });

    $("#kaydet").on("click", function () {
        const data = {
            NickName: $("#nickname").val(),
            Camera: $("#Camera option:selected").text(),
            CameraModel: $("#cameraModel option:selected").text()
        }
        addAirCraft(data);
    });

    $("#updateButton").click(function () {
        updateAircraft(
            $('#localKey').val()
        );
    });

    $("#flights").click(function () {
        window.location.href = "Plan.html";
        console.log("asdasd");
    });

    getFutureFlights();
    getAllAircraftsToSidebar();
});

var map;
var infoWindow;

var displayedFlight;
var CamerasAndModel = {};
CamerasAndModel['GoPro'] = [' ', 'Karma'];
CamerasAndModel['Hubsan'] = [' ', 'H501S', 'H501SS', 'X4'];

/**API ISTEKLER */
function getAllAircraftsToSidebar() {
    $("#aircraftsList #aircraftsListBinding #aircraftsListBindingUl").empty();
    getAllAirCraftsRequestToApi()
        .done(function (data) {
            $.each(data, function (index, value) {
                $("#aircraftsList #aircraftsListBinding #aircraftsListBindingUl")
                    .append('<li>' +
                        '<div class="row">' +
                        '<div class="col-md-8 pr-0" style="margin-right:0px;">' +
                        '<button class="list-group-item list-group-item-action bg-light pl-3" style="font-size:13px; line-height:1;">' + value.NickName + '</button>' +
                        '</div>' +
                        '<div class="col-md-1 pl-0">' +
                        '<button id="' + value.Id + '" onclick="deleteAirCraft(this.id,' + 1 + ')" class="btn btn-light p-1"><i class="fa fa-trash"></i></button>' +
                        '</div>' +
                        '</div>' +
                        '</li>');
            });

        }).fail(function (jqXhr, textStatus) {
            console.log(jqXhr.responseText);
        });

}

function getFutureFlights() {
    $("#flightsList #flightsListBinding #flightsListBindingUl").empty();
    getAllFlightsRequestToApi()
        .done(function (data) {
            $.each(data, function (index, value) {
                $("#flightsList #flightsListBinding #flightsListBindingUl")
                    .append('<li>' +
                        '<div class="row">' +
                        '<div class="col-md-8 pr-0" style="margin-right:0px;">' +
                        '<button id="' + value.Id + '" onclick="getFlightById(this.id)" class="list-group-item list-group-item-action bg-light pl-3" style="font-size:13px; line-height:1;">' + new Date(value.Date).toLocaleString() + '</button>' +
                        '</div>' +
                        '<div class="col-md-1 pl-0">' +
                        '<button id="' + value.Id + '" onclick="deleteFlight(this.id)" class="btn btn-light p-1"><i class="fa fa-trash"></i></button>' +
                        '</div>' +
                        '</div>' +
                        '</li>');
            });

        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            alertify.error("There is something wrong! Please try again!");
        });
}

function getFlightById(id) {
    getFlightByIdRequestToApi(id)
        .done(function (data) {

            var content = {
                isAirport: 0,
                info: data.Aircraft.NickName + "<br /><br />" + data.Aircraft.Camera + " / " + data.Aircraft.CameraModel,
                isWillZoom: 1
            };

            // if there is Flight on the screen, remove it.
            if (displayedFlight) {
                displayedFlight.setMap(null);
                displayedFlight = null;
            }

            if (data.Geo.type == "Polygon") {
                displayedFlight = createPolygonOnMap(data, content, map); // store the flight into global variable which is displayedFlight
            } else
                displayedFlight = createPolylineOnMap(data, content, map); // store the flight into global variable which is displayedFlight

        }).fail(function (jqXHR, textStatus) {
            alertify.error("There is something wrong! Please try again!");
        });

}

function deleteFlight(id) {
    alertify.confirm("Warning!", "Are you sure to delete ?",
        function () { // When clicked OK
            deleteFlightRequestToApi(id)
                .done(function (data) {
                    alertify.success("Successfully deleted!");
                    getFutureFlights();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                    alertify.error("There is something wrong! Please try again!");
                });
        },
        function () { // When clicked Cancel
        });
}

function getAllAircraftsToModal() {

    getAllAirCraftsRequestToApi()
        .done(function (data) {

            $("#jscontrol").empty();
            var items = [];
            $.each(data, function (index, value) {
                items.push("<label class='TitleList'>Name</label>" + " " + value.NickName +
                    ' <input onclick="deleteAirCraft(this.id)" id=' + value.Id + ' type=button class="btn btn-danger delete"  value="Sil">' +
                    ' <input onclick="getAirCraftById(this.id)" id="' + value.Id + '"' +
                    'type = button class= "btn btn-success edit" data - dismiss="modal" data - toggle="modal"' +
                    ' data-target="#UpdateAir" value = "Edit" > ' + "<br>" +
                    " <label class='TitleList'>Camera</label>" + " " + value.Camera + "<br>" +
                    " <label class='TitleList'>Model</label>" + " " + value.CameraModel + "<hr>")
            });
            $("<ul/>", {
                "class": "new-list",
                html: items.join("")
            }).appendTo("#jscontrol");

            $("body").show();

        }).fail(function (jqXhr, textStatus) {
            console.log(jqXhr.responseText);
            alertify.error("There is something wrong! Please try again!");
        });
}

function addAirCraft(airCraft) {

    addAirCraftRequestToApi(airCraft)
        .done(function (data) {
            alertify.success("Successfully added new Aircraft!");
            getAllAircraftsToModal();
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            alertify.error("There is something wrong! Please try again!");
        });
}

function getAirCraftById(id) {

    getAirCraftByIdRequestToApi(id)
        .done(function (data) {
            putAircraftInfoToEditForm(data);
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            alertify.error("There is something wrong! Please try again!");
        });

}

function deleteAirCraft(id, fromWhichPart) {
    alertify.confirm("Warning!", "Are you sure to delete ?",
        function () { // When clicked OK
            deleteAirCraftRequestToApi(id)
                .done(function (data) {
                    alertify.success("Successfully deleted!");
                    if (fromWhichPart)
                        getAllAircraftsToSidebar();
                    else
                        getAllAircraftsToModal();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                    alertify.error("There is something wrong! Please try again!");
                });
        },
        function () { // When clicked Cancel
        });

}

function updateAircraft(id) {

    const data = {
        Id: id,
        NickName: $("#EditName").val(),
        Camera: $("#EditCamera option:selected").text(),
        CameraModel: $("#EditModel option:selected").text()
    }

    updateAircraftRequestToApi(data)
        .done(function (data) {
            alertify.success("Successfully updated!");
            getAllAircraftsToModal();
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            alertify.error("There is something wrong! Please try again!");
        });
}

/**API ISTEKLER  BİTİŞ*/

function displayAircrafts(data) {
    $("#jscontrol").empty();
    var items = [];
    $.each(data, function (index, value) {
        items.push("<label class='TitleList'>Name</label>" + " " + value.NickName +
            ' <input onclick="deleteAirCraft(this.id)" id=' + value.Id + ' type=button class="btn btn-danger delete"  value="Sil">' +
            ' <input onclick="getAirCraftById(this.id)" id="' + value.Id + '" type=button class="btn btn-success edit" data-dismiss="modal" data-toggle="modal" data-target="#UpdateAir" value="Edit">' + "<br>" +
            " <label class='TitleList'>Camera</label>" + " " + value.Camera + "<br>" +
            " <label class='TitleList'>Model</label>" + " " + value.CameraModel + "<hr>")
    });
    $("<ul/>", {
        "class": "new-list",
        html: items.join("")
    }).appendTo("#jscontrol");

    $("body").show();
}

function putAircraftInfoToEditForm(data) {
    document.getElementById("EditName").value = data.NickName;
    document.getElementById("EditCamera").value = data.Camera;

    ChangeCameraList("edit");
    var modelIndex = CamerasAndModel[data.Camera].indexOf(data.CameraModel);

    document.getElementById("EditModel").value = modelIndex;
    document.getElementById("localKey").value = data.Id;
}

function ChangeCameraList(type) {

    var cameraList = type == "save" ? document.getElementById("Camera") : document.getElementById("EditCamera");
    var modelList = type == "save" ? document.getElementById("cameraModel") : document.getElementById("EditModel");
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

function clearAddAirFields() {
    $('#nickname').val('');
    $('#Camera')[0].selectedIndex = 0;
    $('#cameraModel').empty();
}


$('#UpdateAir').on('hidden.bs.modal', function (e) {

    document.getElementById("localKey").value = "";
})

$('#AddAir').on('hidden.bs.modal', function (e) {
    clearAddAirFields();
})

$('#AirModal').on('hidden.bs.modal', function (e) {
    getAllAircraftsToSidebar();
})

/** GOOGLE MAP */
function initMap() {
    var options = {
        zoom: 5,
        center: { lat: 41.008298, lng: 28.978358 },
        mapTypeControl: false,
        streetViewControl: false

    }

    map = new google.maps.Map(document.getElementById('map'), options);

    infoWindow = new google.maps.InfoWindow({
        //content: "deneme content",
        size: new google.maps.Size(150, 50)
    });

    //map.controls[google.maps.ControlPosition.LEFT_TOP].push(createDatePicker("dtpStart"));
    //map.controls[google.maps.ControlPosition.LEFT_TOP].push(createDatePicker("dtpEnd"));
    //map.controls[google.maps.ControlPosition.LEFT_TOP].push(createDatePickerButton("btnFilter"));

}
/** GOOGLE MAP End */


/** Sonra bakılacak. (Tarihler arası sıralama) */
//function createControlUI() {

//    var controlUI = document.createElement('div');
//    controlUI.style.backgroundColor = '#fff';
//    controlUI.style.border = '0px solid #fff';
//    controlUI.style.borderRadius = '3px';
//    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
//    controlUI.style.cursor = 'pointer';
//    controlUI.style.margin = '2px';
//    controlUI.style.textAlign = 'center';

//    return controlUI;
//}

//function createDatePicker(id) {
//    var datepickerDiv = document.createElement('div');

//    var controlUI = createControlUI();
//    datepickerDiv.appendChild(controlUI);

//    var controlDTP = document.createElement('input');
//    controlDTP.type = "text";
//    controlDTP.className = "form-control";
//    controlDTP.id = id;
//    controlDTP.title = "Click to set start date";
//    controlUI.appendChild(controlDTP);

//    controlDTP.addEventListener('click', function () {
//        $('#' + id).datetimepicker({
//            format: "DD/MM/YYYY HH:mm",
//            locale: "tr"
//        });
//    });

//    return datepickerDiv;
//}

//function createDatePickerButton(id) {
//    var datePickerButtonDiv = document.createElement('div');

//    var controlUI = createControlUI();
//    datePickerButtonDiv.appendChild(controlUI);

//    var controlDTPbtnFilter = document.createElement('button');
//    controlDTPbtnFilter.innerHTML = "Filter";
//    controlDTPbtnFilter.className = "btn btn-info";
//    controlDTPbtnFilter.id = id;
//    controlDTPbtnFilter.title = "Click to set filter";
//    controlUI.appendChild(controlDTPbtnFilter);

//    return datePickerButtonDiv;
//}

