using DronomAI.Models;
using DronomAI.Repositories;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace DronomAI.Controllers
{
    public class IntersectsController : ApiController
    {
        [HttpPost]
        public async Task<HttpResponseMessage> CheckIntersect([FromBody]JObject flightGeoInfo)
        {
            var jo = BsonDocument.Parse(flightGeoInfo.ToString());
            try
            {
                string type = flightGeoInfo["type"].ToString();
                BsonArray coordinates = jo["coordinates"].AsBsonArray;
                Intersect intersect = await IntersectRepository.CheckFlightIntersection(type, coordinates);
                return Request.CreateResponse<Intersect>(HttpStatusCode.OK, intersect);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message.ToString());
            }
        }
    }
}
