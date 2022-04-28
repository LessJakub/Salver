using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Annotations
{
    public class AddressAnnotation : CustomAnnotation
    {
        public AddressAnnotation(int minLength=1)
        {
            ErrorMessage = $"Must be a proper address";

            _attributes = new ValidationAttribute[]
            {
                new MinLengthAttribute(minLength)
            };
        }
    }
}