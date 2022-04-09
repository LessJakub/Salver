import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  host: {'class': 'flex-auto flex justify-center items-start'}, // ! Styling host container to fill all avialable space
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {

    mealImageUrl: String

    constructor() {
        this.mealImageUrl = '/assets/images/mealImageLanding.jpg'
    }

    ngOnInit(): void {}

}
