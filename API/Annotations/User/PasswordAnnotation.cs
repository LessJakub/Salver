using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Annotations
{ 
    sealed public class PasswordAnnotation : CustomAnnotation
    {
        public PasswordAnnotation(int minLength=6, int maxLength=20)
        {
            ErrorMessage = $"Password must have between {minLength}-{maxLength} characters";

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