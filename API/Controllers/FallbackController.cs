using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;





namespace API.Controllers
{
    public class FallbackController : Controller
   {
       public IActionResult Index()
       {
           return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
               "wwwroot", "index.html"), MediaTypeNames.Text.Html);
       }  
   }
}