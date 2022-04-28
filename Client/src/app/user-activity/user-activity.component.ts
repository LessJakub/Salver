import { Component, OnInit } from '@angular/core';

import { Post } from '../models/post';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
  host: {'class': 'flex flex-initial items-center h-full w-full'}, // ! Styling host container to fill all avialable space
})
export class UserActivityComponent implements OnInit {

  constructor() { }

  fetchedPosts : Post[] | null;

  ngOnInit(): void {
    this.fetchedPosts = [
      {date: new Date(2022, 4, 16), likes: 13, imageURL: "/assets/images/3W2A0606@0.5x.webp", description: "Great sushy!", taggedRestaurant: "SushiDoo", user: "Daniel Hankel"},
      {date: new Date(2022, 4, 16), likes: 2, imageURL: "/assets/images/W2A6423@0.5x.webp", description: "Very tasty!", taggedRestaurant: "SushiDoo", user: "Eli Bentalc"},
      {date: new Date(2022, 4, 17), likes: 134, imageURL: "/assets/images/3W2A0925@0.5x.webp", description: "A bit bland", taggedRestaurant: "SushiDoo", user: "Margaret Nam"},
      {date: new Date(2022, 4, 11), likes: 8, imageURL: "/assets/images/3W2A0956@0.5x.webp", description: "Wow, this is such a nice place with fantastic food. If you're looking for great sushi and very friendly sushimasters then this is the spot! I've been to many sushi bars but this one is going to really make me visit over and over again! 100% reccomend!", taggedRestaurant: "SushiDoo", user: "Billie Thongroght"}
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
