using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DronomAI.Models
{
    public class Airport
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }
        public String Name { get; set; }
        public GeoBson Geo { get; set; }
    }

    public class AirportInput
    {
        public String Id { get; set; }
        public String Name { get; set; }
        public JObject Geo { get; set; }
    }
}