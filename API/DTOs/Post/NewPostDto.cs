using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class NewPostDto
    {
        [PostDescriptionAnnotation]
        public string Description { get; set; }
    }
}