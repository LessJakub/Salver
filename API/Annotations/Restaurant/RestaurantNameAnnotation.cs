using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class RestaurantNameAnnotation : CustomAnnotation
    {
        public RestaurantNameAnnotation(int minLength=3, int maxLength=20)
        {
            ErrorMessage = $"Restaurant name must have between {minLength}-{maxLength} characters";

            _attributes = new ValidationAttribute[]
            {
                new StringLengthAttribute(maxLength)
                {
                    MinimumLength = minLength,
                    
                }
            };
        }
    }
}