using DronomAI.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace DronomAI.Repositories
{
    public class IntersectRepository
    {
        public static async Task<Intersect> CheckFlightIntersection(string type, BsonArray coordinates)
        {
            var query = BsonDocument.Parse("{" +
                "Geo:{" +
                        "$geoIntersects:{" +
                            "$geometry:{" +
                                "type: '" + type + "'" +
                                "coordinates:" + coordinates +
                            "}" +
                        "}" +
                    "}" +
                "}");
            return new Intersect()
            {
                FlightList = await FlightRepository.Get.Find(query).ToListAsync(),
                AirportList = await AirportRepository.Get.Find(query).ToListAsync()
            };
        }
    }
}