using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Footprint.web.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        
        [HttpGet,Route("test")]
        [Authorize]
        public async Task<IActionResult> AuthTest()
        {
            var s = User.Identity.IsAuthenticated;

            return Ok("ok1");

            //return Unauthorized();
        }



    }
}
