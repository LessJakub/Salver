using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class DishNameAnnotation : CustomAnnotation
    {
        public DishNameAnnotation(int minLength=0, int maxLength=20)
        {
            ErrorMessage = $"Ingridients must have between {minLength}-{maxLength} characters";

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