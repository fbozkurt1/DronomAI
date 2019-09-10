using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace DronomAI.Repositories
{
    public static class DB
    {
        private static IMongoDatabase _mongoDB;
        private static IMongoClient _mongoClient;

        public static IMongoDatabase Get => _mongoDB;

        public static void Initialize()
        {
            _mongoClient = new MongoClient(ConfigurationManager.AppSettings["connectionString"]);
            _mongoDB = _mongoClient.GetDatabase("dronom");
        }
    }
}