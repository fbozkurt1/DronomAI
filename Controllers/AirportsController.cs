using DronomAI.Models;
using DronomAI.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace DronomAI.Controllers
{
    public class AirportsController : ApiController
    {
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllAirports()
        {
            List<Airport> airports = await AirportRepository.GetAllAirports();
            if (airports.Count >= 0)
                return Request.CreateResponse<List<Airport>>(HttpStatusCode.OK, airports);

            return Request.CreateResponse(HttpStatusCode.NotFound, "While retrieving all Airports, error occured!");
        }
    }
}
