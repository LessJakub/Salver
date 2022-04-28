using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class NewDishReviewDto
    {
        [RatingAnnotation]
        public int Rating { get; set; }

        [RatingDescriptionAnnotation]
        public string Description { get; set; }
    }
}