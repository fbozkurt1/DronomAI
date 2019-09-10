using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DronomAI.Models
{
    public class GeoBson
    {
        public string type { get; set; }
        public BsonArray coordinates { get; set; }
    }
}