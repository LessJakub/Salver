using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class NewOrderDTO
    {   
        [Required]
        public string Address { get; set; }

        [Required, MinLength(1)]
        public int[] Dishes { get; set; }

        [Required]
        public Status Status { get; set; }

        [Required]
        public DateTime SubmitTime { get; set; }

        [Required]
        public TimeSpan ExpectedTime { get; set; }

        [Required]
        public int RestaurantId { get; set; }
    }
}