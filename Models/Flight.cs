using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Newtonsoft.Json.Linq;

namespace DronomAI.Models
{
    public class Flight
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }

        public AirCraft Aircraft { get; set; }

        public int Altitude { get; set; }

        public DateTime Date { get; set; }

        public int Duration { get; set; }

        public GeoBson Geo { get; set; }
    }

    public class FlightInput
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }

        public String AircraftId { get; set; }

        public int Altitude { get; set; }

        public string Date { get; set; }

        public int Duration { get; set; }

        public JObject Geo { get; set; }
        
    }

    public class FlightBetweenDates
    {
        public string startDate { get; set; }
        public string endDate { get; set; }

    }
}