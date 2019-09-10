using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using DronomAI.Models;

namespace DronomAI.Repositories
{
    
    public static class AirCraftRepository
    {
        private static IMongoCollection<AirCraft> airCraftCollection;
        
        public static void Init()
        {
            airCraftCollection = DB.Get.GetCollection<AirCraft>("AirCrafts");
        }

        public static async Task<bool> AddAirCraft(AirCraft airCraft)
        {
            try
            {
                await airCraftCollection.InsertOneAsync(airCraft);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static async Task<List<AirCraft>> GetAllAirCrafts()
        {
            return await airCraftCollection.Find(new BsonDocument()).ToListAsync();
        }

        public static async Task<List<AirCraft>> GetAirCraftsByField(string fieldName, string fieldValue)
        {
            var filter = Builders<AirCraft>.Filter.Eq(fieldName, fieldValue);
            var result = await airCraftCollection.Find(filter).ToListAsync();

            return result;
        }

        public static async Task<AirCraft> GetAirCraftById(ObjectId id)
        {
            var filter = Builders<AirCraft>.Filter.Eq("_id", id);
            var result = await airCraftCollection.Find(filter).FirstOrDefaultAsync();

            return result;
        }

        public static async Task<bool> UpdateAirCraft(AirCraft newAirCraft)
        {
            var filter = Builders<AirCraft>.Filter.Eq("_id", new ObjectId(newAirCraft.Id));
            var update = Builders<AirCraft>.Update.Set("NickName", newAirCraft.NickName)
                                                  .Set("Camera", newAirCraft.Camera)
                                                  .Set("CameraModel", newAirCraft.CameraModel);

            var result = await airCraftCollection.UpdateManyAsync(filter, update);

            return result.ModifiedCount != 0;
        }

        public static async Task<bool> DeleteAircraft(ObjectId id)
        {
            var filter = Builders<AirCraft>.Filter.Eq("_id", id);
            var result = await airCraftCollection.DeleteOneAsync(filter);

            return result.DeletedCount != 0;
        }

        // pagination için kullanılabilir
        //public async Task<List<AirCraft>> GetAirCrafts(int startingFrom, int count)
        //{
        //    var result = await airCraftCollection.Find(new BsonDocument())
        //                                       .Skip(startingFrom)
        //                                       .Limit(count)
        //                                       .ToListAsync();

        //    return result;
        //}
    }
}