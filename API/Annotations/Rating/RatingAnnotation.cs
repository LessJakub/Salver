using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class RatingAnnotation : CustomAnnotation
    {
         

        public RatingAnnotation(int minRating = 0, int maxRating=5)
        {
            ErrorMessage = $"Rating must be beetween {minRating}-{maxRating}";

            _attributes = new ValidationAttribute[]
            {
                new RangeAttribute(minRating, maxRating)
            };
        }
    }
}