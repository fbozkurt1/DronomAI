using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DronomAI.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Configuration;
using System.Threading.Tasks;
using DronomAI.Repositories;

namespace DronomAI.Controllers
{

    public class AirCraftsController : ApiController
    {
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllAirCrafts()
        {
            List<AirCraft> airCrafts = await AirCraftRepository.GetAllAirCrafts();
            if (airCrafts.Count > 0)
                return Request.CreateResponse<List<AirCraft>>(HttpStatusCode.OK, airCrafts);
            return Request.CreateResponse(HttpStatusCode.NotFound, "While retrieving all aircrafts, error occured!");
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAirCraftById(string id)
        {      
            AirCraft airCraft = await AirCraftRepository.GetAirCraftById(new ObjectId(id));
            if (airCraft == null)
                return Request.CreateResponse(HttpStatusCode.NotFound, "Error, AirCraft couldn't find!");

            return Request.CreateResponse<AirCraft>(HttpStatusCode.OK, airCraft);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> AddAirCraft(AirCraft airCraft)
        {

            bool insterted = await AirCraftRepository.AddAirCraft(airCraft);
            if (insterted)
                return Request.CreateResponse(HttpStatusCode.OK, "Successfully added");

            return Request.CreateResponse(HttpStatusCode.InternalServerError, "While adding new aircraft, error occurred!");
        }

        [HttpPost]
        public async Task<HttpResponseMessage> DeleteAirCraft([FromBody]string id)
        {
            bool deleted = await AirCraftRepository.DeleteAircraft(new ObjectId(id));

            if (deleted)
                return Request.CreateResponse(HttpStatusCode.OK, "Successfully deleted.");
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "While deleting aircraft, error occurred!");
        }

        [HttpPost]
        public async Task<HttpResponseMessage> UpdateAirCraft(AirCraft airCraft)
        {
            bool updated = await AirCraftRepository.UpdateAirCraft(airCraft);

            if (updated)
                return Request.CreateResponse(HttpStatusCode.OK, "Successfully updated.");

            return Request.CreateResponse(HttpStatusCode.InternalServerError, "While updating aircraft, error occurred!");
        }


    }
}
