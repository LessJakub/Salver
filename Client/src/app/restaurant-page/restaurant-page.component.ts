import { Component, OnInit } from '@angular/core';

import { Restaurant } from '../models/restaurant';
import { Dish } from '../models/Dish';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css'],
  host: {'class': 'flex-auto flex justify-center items-center'} // ! Styling host container to fill all avialable space
})
export class RestaurantPageComponent implements OnInit {

  restaurant: Restaurant | null;
  fetchedDishes: Dish[];

  constructor() { }

  ngOnInit(): void {
    this.restaurant =  {
      name: "SushiDoo",
      images: ["/assets/images/mealImageLanding.webp"],
      address: "Mickiewicza 10, Warsaw, Poland",
      description: "Come all craving for delicious sushi! Prepared by chefs with deep understanding and passion of the exotic dish, served in beautiful " + 
      "form. Delight in the intricate tastes and velvet textures in a space meticulously curated by top designers.",
      priceRange: "10$ - 150$",
      grades: [{category: "The tastes", grade: 5}, {category: "The space", grade: 5}, {category: "The staff", grade: 4}]
    }

    this.fetchedDishes = [
        {name:"Hosomaki", imageURL:["/assets/images/3W2A0606@0.5x.webp", "/assets/images/3W2A0606@0.5x.webp"], grade:[4, 2, 3, 3], description:"With fresh mango or tuna. 6 pcs",price:15, restaurant: "Japan Sun"},
        {name:"Uramaki",  imageURL:["/assets/images/3W2A0699@0.5x.webp", "/assets/images/3W2A0699@0.5x.webp"], grade:[5, 3, 5, 4], description:"Avocado uramaki with soy sauce.", price:20, restaurant: "Japan Sun"},
        
        { name:"Curry & Shrimps", imageURL:["/assets/images/W2A6423@0.5x.webp", "/assets/images/W2A6423@0.5x.webp"],  grade:[5, 5, 4, 5], 
        description:"Green curry with shrimps, vegetables and jasmin rice. Decorated with edible flowers and coriander. Ideal dish for shrimp-lovers but not only. This is a dummy text which i had to add because im not very creative and i had no idea what to write in the description apart from the ingredients list", 
        price:23, restaurant: "Japan Sun" },
        
        {name:"Fried Ice-Cream", imageURL:["/assets/images/W2A6500@0.5x.webp", "/assets/images/W2A6500@0.5x.webp"], grade:[4, 3, 2, 3], description:"Fried ice cream with mango pulp", price:17,restaurant: "Japan Sun"},
        {name:"Fusion Rolls", imageURL:["/assets/images/W2A6389@0.5x.webp"], grade:[4, 3, 2, 4], description:"Salmon marinated in togarashi, avocado, mango sauce, micro greens", price:24, restaurant: "Japan Sun"},
        {name:"Sashimi", imageURL:["/assets/images/3W2A0746@0.5x.webp"], grade:[3, 1, 2, 3], description:"Salmon, tuna, butterfish, 12 pcs", price:35, restaurant: "Japan Sun"},
        {name:"Wakame Salad", imageURL:["/assets/images/3W2A0956@0.5x.webp"], grade:[5, 4, 5, 5], description:"Seaweed, sesame seeds, cucumber, rice vinegar", price:29, restaurant: "Japan Sun"},
        {name:"Tom Yam Kung ", imageURL:["/assets/images/3W2A0925@0.5x.webp"], grade:[5, 3, 4, 4], description:"Thai soup with shrimps, coconut milk and vegetables", price:26, restaurant: "Japan Sun"},
    ]
  }

}
