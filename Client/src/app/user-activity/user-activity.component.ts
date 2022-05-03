import { Component, OnInit } from '@angular/core';

import { Post } from '../models/post';
import { Dish } from '../models/Dish';
import { GradeComponentComponent } from '../overlays/dish-overlay/grade-component/grade-component.component';
import { SearchTileComponent } from '../search-page/search-tile/search-tile.component';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
  host: {'class': 'flex flex-initial items-center h-full w-full'}, // ! Styling host container to fill all avialable space
})
export class UserActivityComponent implements OnInit {

  constructor() { }

  fetchedPosts : Post[] | null;
  reccomendations : Dish[] | null;

  ngOnInit(): void {
    this.fetchedPosts = [
      {date: new Date(2022, 4, 16), likes: 13, imageURL: "/assets/images/3W2A0606@0.5x.webp", description: "Great sushy!", taggedRestaurant: "SushiDoo", user: "Daniel Hankel"},
      {date: new Date(2022, 4, 16), likes: 2, imageURL: "/assets/images/W2A6423@0.5x.webp", description: "Very tasty!", taggedRestaurant: "SushiDoo", user: "Eli Bentalc"},
      {date: new Date(2022, 4, 17), likes: 134, imageURL: "/assets/images/3W2A0925@0.5x.webp", description: "A bit bland", taggedRestaurant: "SushiDoo", user: "Margaret Nam"},
      {date: new Date(2022, 4, 11), likes: 8, imageURL: "/assets/images/3W2A0956@0.5x.webp", description: "Wow, this is such a nice place with fantastic food. If you're looking for great sushi and very friendly sushimasters then this is the spot! I've been to many sushi bars but this one is going to really make me visit over and over again! 100% reccomend! By the way check out my account for other reccomendations of the best restaurants round town!", taggedRestaurant: "SushiDoo", user: "Billie Thongroght"}
    ]

    this.reccomendations = [
      {name:"Hosomaki", imageURL:["/assets/images/3W2A0606@0.5x.webp", "/assets/images/3W2A0606@0.5x.webp"], grade:2, description:"With fresh mango or tuna. 6 pcs",price:15, restaurant: "Japan Sun"},
      {name:"Uramaki",  imageURL:["/assets/images/3W2A0699@0.5x.webp", "/assets/images/3W2A0699@0.5x.webp"], grade:3, description:"Avocado uramaki with soy sauce.", price:20, restaurant: "Japan Sun"},
      {name:"Curry & Shrimps", imageURL:["/assets/images/W2A6423@0.5x.webp", "/assets/images/W2A6423@0.5x.webp"],  grade:5, description:"Green curry with shrimps, vegetables and jasmin rice", price:23, restaurant: "Japan Sun"},
      {name:"Fried Ice-Cream", imageURL:["/assets/images/W2A6500@0.5x.webp", "/assets/images/W2A6500@0.5x.webp"], grade:5, description:"Fried ice cream with mango pulp", price:17,restaurant: "Japan Sun"},
      {name:"Fusion Rolls", imageURL:["/assets/images/W2A6389@0.5x.webp"], grade:4, description:"Salmon marinated in togarashi, avocado, mango sauce, micro greens", price:24, restaurant: "Japan Sun"},
    ]
  }

  prettyTimeFromDate(time: Date): string {
    return time.toLocaleDateString(navigator.language, {
      year: '2-digit',
      month:'2-digit',
      day:  '2-digit',
    });
  }

}
