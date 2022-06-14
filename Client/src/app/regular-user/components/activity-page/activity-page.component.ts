import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/models/post';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
    selector: 'app-activity-page',
    templateUrl: './activity-page.component.html',
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class ActivityPageComponent implements OnInit {

    constructor(private searchService: SearchService, private activityService: ActivityService) { }

    fetchedPosts: Post[] | null;
    recommendations: DishDTO[] = [];

    async generateRecommendations() {
        await this.searchService.searchDishes(null);

        if (this.searchService.dishes == null || this.searchService.dishes.length == 0) {
            console.log("No dishes found.")
            return;
        }
        else {
            var shuffledRecs = this.searchService.dishes.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        }

        var usedIDs: number[] = [];

        if (shuffledRecs != null && shuffledRecs[0]) {
            shuffledRecs.forEach((dish: DishDTO) => {
                if (dish.appRestaurantId != NaN)
                    if (usedIDs.includes(dish.appRestaurantId) == false) {
                        this.recommendations.push(dish);
                        usedIDs.push(dish.appRestaurantId);
                    }
            })
        }
    }

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";

    async ngOnInit() {

        this.generateRecommendations();
        //this.fetchedPosts = 
        var dtos = await this.activityService.getUserActivities();
        this.fetchedPosts = new Array<Post>();
        
        this.fetchedPosts = [
            { date: new Date(2022, 4, 16), likes: 13, imageURL: "/assets/images/3W2A0606@0.5x.webp", description: "Great sushy!", taggedRestaurant: "SushiDoo", user: "Daniel Hankel", grades: [{ category: "Taste", grade: 5 }, { category: "Serving", grade: 5 }, { category: "Atmosphere", grade: 5 }], taggedRestaurantId: 0 },
            {
                date: new Date(2022, 4, 11), likes: 8, imageURL: "/assets/images/3W2A0956@0.5x.webp", description: "Wow, this is such a nice place with fantastic food. If you're looking for great sushi and very friendly sushimasters then this is the spot! " +
                    "I've been to many sushi bars but this one is going to really make me visit over and over again! 100% reccomend! By the way check out my account for other reccomendations of the best restaurants round town!", taggedRestaurant: "SushiDoo", user: "Billie Thongroght",
                grades: [{ category: "Taste", grade: 5 }, { category: "Atmosphere", grade: 5 }, { category: "Service", grade: 5 }, { category: "Price", grade: 4 }, { category: "Serving", grade: 5 }], taggedRestaurantId: 0
            },
            { date: new Date(2022, 4, 16), likes: 2, imageURL: "/assets/images/W2A6423@0.5x.webp", description: "Very tasty!", taggedRestaurant: "SushiDoo", user: "Eli Bentalc", grades: [{ category: "Taste", grade: 5 }, { category: "Price", grade: 3 }], taggedRestaurantId: 0 },
            { date: new Date(2022, 4, 17), likes: 134, imageURL: "/assets/images/3W2A0925@0.5x.webp", description: "A bit bland", taggedRestaurant: "SushiDoo", user: "Margaret Nam", grades: [{ category: "Taste", grade: 3 }], taggedRestaurantId: 0 },
            {
                date: new Date(2022, 4, 11), likes: 8, imageURL: "/assets/images/3W2A0956@0.5x.webp", description: "Wow, this is such a nice place with fantastic food. If you're looking for great sushi and very friendly sushimasters then this is the spot! " +
                    "I've been to many sushi bars but this one is going to really make me visit over and over again! 100% reccomend! By the way check out my account for other reccomendations of the best restaurants round town!", taggedRestaurant: "SushiDoo", user: "Billie Thongroght",
                grades: [{ category: "Taste", grade: 5 }, { category: "Atmosphere", grade: 5 }, { category: "Service", grade: 5 }, { category: "Price", grade: 4 }, { category: "Serving", grade: 5 }], taggedRestaurantId: 0
            }
        ]
        
        dtos.forEach(d =>
        {
            console.log(d);
            if(d.appRestaurantId != 0)
            {
                this.fetchedPosts.push({
                    imageURL: this.postBlobBaseURL + d.id + '.webp',
                    user: null,
                    date: d.date,
                    likes: d.likes,
                    taggedRestaurant: d.name,
                    taggedRestaurantId: d.appRestaurantId,
                    description: d.description,
                    grades: null
                    //    
                    
                })
            }
            else if(d.appUserId != 0)
            {
                this.fetchedPosts.push({
                    imageURL: this.postBlobBaseURL + d.id + '.webp',
                    user: d.username,
                    date: d.date,
                    likes: d.likes,
                    taggedRestaurant: null,
                    taggedRestaurantId: null,
                    description: d.description,
                    grades: null
                })
            }
            
        })
        
        
        
        // this.reccomendations = [
        //     {name:"Fried Ice-Cream", imageURL:["/assets/images/W2A6500@0.5x.webp", "/assets/images/W2A6500@0.5x.webp"], grade:[4, 3, 2, 3], description:"Fried ice cream with mango pulp", price:17,restaurant: "Japan Sun"},
        //     {name:"Fusion Rolls", imageURL:["/assets/images/W2A6389@0.5x.webp"], grade:[4, 3, 2, 4], description:"Salmon marinated in togarashi, avocado, mango sauce, micro greens", price:24, restaurant: "Japan Sun"},
        //     {name:"Sashimi", imageURL:["/assets/images/3W2A0746@0.5x.webp"], grade:[3, 1, 2, 3], description:"Salmon, tuna, butterfish, 12 pcs", price:35, restaurant: "Japan Sun"},
        //     {name:"Wakame Salad", imageURL:["/assets/images/3W2A0956@0.5x.webp"], grade:[5, 4, 5, 5], description:"Seaweed, sesame seeds, cucumber, rice vinegar", price:29, restaurant: "Japan Sun"},
        //     {name:"Tom Yam Kung ", imageURL:["/assets/images/3W2A0925@0.5x.webp"], grade:[5, 3, 4, 4], description:"Thai soup with shrimps, coconut milk and vegetables", price:26, restaurant: "Japan Sun"},
        // ]
    }

}
