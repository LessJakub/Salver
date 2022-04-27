using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class UsernameAnnotation : CustomAnnotation
    {
        public UsernameAnnotation(int minLength=3, int maxLength=14)
        {
            ErrorMessage = $"Username must have between {minLength}-{maxLength} characters";

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