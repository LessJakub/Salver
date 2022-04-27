using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class RestaurantRegisterDto
    {
        [Required]
        [RestaurantNameAnnotation]
        public string Name { get; set; }

        [Required]
        [RestaurantDescriptionAnnotation]
        public string Description { get; set; }

        [Required]
        [AddressAnnotation]
        public string Address { get; set; }
    }
}