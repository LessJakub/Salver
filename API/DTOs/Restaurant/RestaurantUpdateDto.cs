using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class RestaurantUpdateDto
    {

        [RestaurantNameAnnotation]
        public string Name { get; set; }

        [RestaurantDescriptionAnnotation]
        public string Description { get; set; }

        [AddressAnnotation]
        public string Address { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }
    }
}