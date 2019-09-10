using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DronomAI.Models
{
    public class AirCraft
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }

        [BsonElement("NickName")]
        public string NickName { get; set; }

        [BsonElement("Camera")]
        public string Camera { get; set; }

        [BsonElement("CameraModel")]
        public string CameraModel { get; set; }
    }
}