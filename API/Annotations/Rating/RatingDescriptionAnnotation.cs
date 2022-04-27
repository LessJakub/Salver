using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class RatingDescriptionAnnotation : CustomAnnotation
    {
        public RatingDescriptionAnnotation(int minLength = 0, int maxLength = 250)
        {
            ErrorMessage = $"Rating must have between {minLength}-{maxLength} characters";

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