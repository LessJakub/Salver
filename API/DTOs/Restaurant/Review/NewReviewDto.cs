using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class NewReviewDto
    {
        [RatingAnnotation]
        public int AtmosphereRating { get; set; }

        [RatingAnnotation]
        public int ServiceRating { get; set; }

        [RatingDescriptionAnnotation]
        public string Description { get; set; }
    }
}