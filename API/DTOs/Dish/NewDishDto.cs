using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class NewDishDto
    {
        [DishNameAnnotation]
        public string Name { get; set; }

        [DishDescriptionAnnotation]
        public string Description { get; set; }

        [DishIngredientsAnnotation]
        public string Ingredients { get; set; }

        [Range(0,Int64.MaxValue)]
        public float Price { get; set; }
    }
}