using System;
using System.Collections.Generic;
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

        public float Price { get; set; }
    }
}