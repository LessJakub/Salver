using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class RestaurantDescriptionAnnotation : CustomAnnotation
    {
        public RestaurantDescriptionAnnotation(int minLength=0, int maxLength=200)
        {
            ErrorMessage = $"Description must have between {minLength}-{maxLength} characters";

            _attributes = new ValidationAttribute[]
            {
                new StringLengthAttribute(maxLength)
                {
                    MinimumLength = minLength
                    
                }
            };
        }
    }
}