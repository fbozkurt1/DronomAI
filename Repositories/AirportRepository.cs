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
    public class AirportRepository
    {
        private static IMongoCollection<Airport> airportCollection;
        public static void Init() => airportCollection = DB.Get.GetCollection<Airport>("Airports");
        public static IMongoCollection<Airport> Get => airportCollection;
        public static IMongoCollection<Airport> GetCollection() => airportCollection;
        public static async Task<List<Airport>> GetAllAirports()
        {
            return await airportCollection.Find(new BsonDocument()).ToListAsync();
        }
    }
}