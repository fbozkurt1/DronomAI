using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using DronomAI.Models;

namespace DronomAI.Repositories
{
    public static class FlightRepository
    {
        private static IMongoCollection<Flight> flightCollection;

        public static void Init()
        {
            flightCollection = DB.Get.GetCollection<Flight>("Flights");
        }
        public static IMongoCollection<Flight> Get => flightCollection;

        public static async Task<bool> AddFlight(Flight flight)
        {
            try
            {
                await flightCollection.InsertOneAsync(flight);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static async Task<Flight> GetFlight(ObjectId id)
        {
            var filter = Builders<Flight>.Filter.Eq("_id", id);
            var result = await flightCollection.Find(filter).FirstOrDefaultAsync();

            return result;
        }
        public static async Task<List<Flight>> GetAllFlights()
        {
            return await flightCollection.Find(new BsonDocument()).ToListAsync();
        }
        public static async Task<List<Flight>> GetFlightsBetweenDate(DateTime startDate, DateTime endDate)
        {
            return await flightCollection.Find(x => x.Date >= startDate & x.Date <= endDate).ToListAsync();
        }
        public static async Task<bool> DeleteFlight(ObjectId id)
        {
            var filter = Builders<Flight>.Filter.Eq("_id", id);
            var result = await flightCollection.DeleteOneAsync(filter);

            return result.DeletedCount != 0;
        }


    }
}