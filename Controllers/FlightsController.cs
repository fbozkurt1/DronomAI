using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using DronomAI.Models;
using MongoDB.Driver.GeoJsonObjectModel;
using DronomAI.Repositories;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using System.Configuration;
using Excel = Microsoft.Office.Interop.Excel;
using System.Runtime.InteropServices;

namespace DronomAI.Controllers
{
    public class FlightsController : ApiController
    {

        [HttpPost]
        public async Task<HttpResponseMessage> AddFlight([FromBody]FlightInput flightInput)
        {
            var geometry = BsonDocument.Parse(flightInput.Geo.ToString());
            AirCraft airCraft = await AirCraftRepository.GetAirCraftById(new ObjectId(flightInput.AircraftId));
            Flight flight = new Flight()
            {
                Aircraft = airCraft,
                Altitude = flightInput.Altitude,
                Date = Convert.ToDateTime(flightInput.Date).ToUniversalTime(),
                Duration = flightInput.Duration,
                Geo = new GeoBson()
                {
                    type = geometry["Type"].AsString,
                    coordinates = new BsonArray(geometry["Coords"].AsBsonArray)
                }
            };

            if (await FlightRepository.AddFlight(flight))
                return Request.CreateResponse(HttpStatusCode.OK, "Successfully Added!");
            else
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "While adding new Flight, error occurred!");

        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetFlightById(string id)
        {
            Flight flight = await FlightRepository.GetFlight(new ObjectId(id));
            if (flight == null)
                return Request.CreateResponse(HttpStatusCode.NotFound, "Error, Flight couldn't find!");

            return Request.CreateResponse<Flight>(HttpStatusCode.OK, flight);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllFlights()
        {
            List<Flight> flights = await FlightRepository.GetAllFlights();
            if (flights.Count >= 0)
                return Request.CreateResponse<List<Flight>>(HttpStatusCode.OK, flights);

            return Request.CreateResponse(HttpStatusCode.NotFound, "While retrieving all flights, error occured!");
        }
        
        [HttpPost]
        public async Task<HttpResponseMessage> GetFlightsBetweenDate([FromBody]FlightBetweenDates flightBetweenDates)
        {
            // Devam edilecek
            DateTime startDate = Convert.ToDateTime(flightBetweenDates.startDate).ToUniversalTime();
            DateTime endDate = Convert.ToDateTime(flightBetweenDates.endDate).ToUniversalTime();

            List<Flight> res = await FlightRepository.GetFlightsBetweenDate(startDate, endDate);
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> DeleteFlight([FromBody]string id)
        {
            bool deleted = await FlightRepository.DeleteFlight(new ObjectId(id));

            if (deleted)
                return Request.CreateResponse(HttpStatusCode.OK, "Successfully deleted.");
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "While deleting flight, error occurred!");
        }

        /** Add data from excel */
        //[HttpPost]
        //public HttpResponseMessage AddAirports(AirportInput airportInput)
        //{
        //    var geometry = BsonDocument.Parse(airportInput.Geo.ToString());

        //    IMongoDatabase mongoDB;
        //    IMongoClient mongoClient;
        //    IMongoCollection<Airport> airportCollection;

        //    mongoClient = new MongoClient(ConfigurationManager.AppSettings["connectionString"]);
        //    mongoDB = mongoClient.GetDatabase("dronom");
        //    airportCollection = mongoDB.GetCollection<Airport>("Airports2");

        //    Airport airport = new Airport()
        //    {
        //        Name = airportInput.Name,
        //        Geo = new GeoBson()
        //        {
        //            type = geometry["Type"].AsString,
        //            coordinates = new BsonArray(geometry["Coords"].AsBsonArray)
        //        }
        //    };

        //    airportCollection.InsertOne(airport);
        //    return Request.CreateResponse(HttpStatusCode.OK, "deneme");

        //}
    }
}
