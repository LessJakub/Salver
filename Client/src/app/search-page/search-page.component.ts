import { Component, OnInit } from '@angular/core';
import { Dish } from '../models/Dish';
import { SearchTileComponent } from './search-tile/search-tile.component';

@Component({
  selector: 'app-search-page',
  host: {'class': 'grow flex items-center'},
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

    dishSearchResults: Dish[] = [
        {name:"Hosomaki", 
        imageURL:"/assets/images/3W2A0606.webp", 
        grade:3, 
        description:"With fresh mango or tuna. 6 pcs",
        price:15},

        {name:"Uramaki",  imageURL:"/assets/images/3W2A0699.webp", grade:5, description:"Avocado uramaki with soy sauce.", price:20},
        {name:"Curry & Shrimps", imageURL:"/assets/images/W2A6423.webp",  grade:5, description:"Green curry with shrimps, vegetables and jasmin rice", price:23},
        {name:"Fried Ice-Cream", imageURL:"/assets/images/W2A6500.webp", grade:5, description:"Fried ice cream with mango pulp", price:17},
        {name:"Fusion Rolls", imageURL:"/assets/images/W2A6389.webp", grade:4, description:"Gold sake", price:24},
        {name:"Sashimi", imageURL:"/assets/images/3W2A0746.webp", grade:3, description:"Salmon, tuna, butterfish, 12 pcs", price:35},
        {name:"Wakame Salad", imageURL:"/assets/images/3W2A0956.webp", grade:5, description:"Seaweed, sesame seeds, cucumber, rice vinegar", price:29},
        {name:"Tom Yam Kung ", imageURL:"/assets/images/3W2A0925.webp", grade:5, description:"Thai soup with shrimps, coconut milk and vegetables", price:26},
    ]

    constructor() { }

    ngOnInit(): void {}

}
