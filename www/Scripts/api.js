
/**
 * 
 * api.js File
 */

/**
 * Aircrafts requests
 */
function addAirCraftRequestToApi(airCraft) {
    return $.ajax({
        contentType: "application/json",
        method: "POST",
        url: "/api/AirCrafts/AddAirCraft",
        data: JSON.stringify(airCraft)
    });
}

function getAllAirCraftsRequestToApi() {
    return $.ajax({
        method: "GET",
        url: "/api/AirCrafts/GetAllAirCrafts",
        dataType: "JSON",
        cache: false
    });
}

function getAirCraftByIdRequestToApi(id) {
    return $.ajax({
        method: "GET",
        url: "/api/AirCrafts/GetAirCraftById/",
        contentType: "JSON",
        data: { id: id },
    });
}

function deleteAirCraftRequestToApi(id) {
    return $.ajax({
        method: "POST",
        url: "/api/AirCrafts/DeleteAirCraft",
        dataType: "JSON",
        data: JSON.stringify(id),
        contentType: 'application/json; charset=utf-8',
    });
}

function updateAircraftRequestToApi(airCraft) {
    return $.ajax({

        contentType: 'application/json; charset=utf-8',
        method: "POST",
        dataType: "JSON",
        url: "/api/AirCrafts/UpdateAirCraft",
        data: JSON.stringify(airCraft)
    });
}


/**
 * Flights requests
 */

function addFlightRequestToApi(flight) {

    return $.ajax({
        contentType: "application/json",
        method: "POST",
        url: "/api/Flights/AddFlight",
        data: JSON.stringify(flight)
    });
}

function getAllFlightsRequestToApi() {

    return $.ajax({
        method: "GET",
        url: "/api/Flights/GetAllFlights",
        dataType: "JSON",
        cache: false
    });
}

function checkIntersectionRequestToApi(shapeData) {

    return $.ajax({
        contentType: "application/json",
        method: "POST",
        url: "/api/Intersects/CheckIntersect",
        data: JSON.stringify(shapeData)
    });

}

function getFlightsBetweenDatesRequestToApi(dates) {

    return $.ajax({
        method: "POST",
        url: "/api/Flights/GetFlightsBetweenDate",
        contentType: "application/json",
        data: JSON.stringify(dates)

    });
}

function deleteFlightRequestToApi(id) {
    return $.ajax({
        method: "POST",
        url: "/api/Flights/DeleteFlight",
        dataType: "JSON",
        data: JSON.stringify(id),
        contentType: 'application/json; charset=utf-8',
    });
}

function getFlightByIdRequestToApi(id) {
    return $.ajax({
        method: "GET",
        url: "/api/Flights/GetFlightById/",
        contentType: "JSON",
        data: { id: id },
    });
}
/*
 * Airports Requests 
 */

function getAllAirportsRequestToApi() {

    return $.ajax({
        method: "GET",
        url: "api/Airports/GetAllAirports",
        dataType: "JSON",
        cache: false
    });
}