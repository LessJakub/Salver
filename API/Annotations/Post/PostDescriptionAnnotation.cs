using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class PostDescriptionAnnotation : CustomAnnotation
    {
        public PostDescriptionAnnotation(int minLength = 0, int maxLength = 250)
        {
             ErrorMessage = $"Post must have between {minLength}-{maxLength} characters";

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