using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private IBlobService _blobService;

        public UploadController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost(""), DisableRequestSizeLimit]
        public async Task<ActionResult> UploadProfilePicture()
        {
            IFormFile file = Request.Form.Files[0];
            string blobContainer = Request.Form["blobContainer"];
            string fileID = Request.Form["fileID"];

            if (file == null || blobContainer == null || blobContainer == "")
            {
                return BadRequest();
            }

            var result = await _blobService.UploadFileBlobAsync(blobContainer, file.OpenReadStream(), file.ContentType, fileID);
            var toReturn = result.AbsoluteUri;

            return Ok(new { path = toReturn });
        }
    }
}