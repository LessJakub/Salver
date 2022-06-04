import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Dish } from '../models/Dish';
import { Restaurant } from '../models/restaurant';
import { SearchService } from '../services/search.service';
import { SearchTileComponent } from './search-tile/search-tile.component';
import { RestaurantTileComponent } from './restaurant-tile/restaurant-tile.component';
import { SearchForm } from '../models/SearchForm';

@Component({
  selector: 'app-search-page',
  host: {'class': 'grow flex items-center'},
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

    searchForm: SearchForm;

    filteredSearchResults: any[];
    searchResultsType: string = "Dish";

    dishSearchResults: Dish[] = [
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

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.updateFilteredArray();
    }

    updateSearchForm(newForm: SearchForm) {
        this.searchForm = newForm;
        console.log(this.searchForm)
        this.updateFilteredArray();
    }

    updateFilteredArray() {
        if (this.searchForm == null) {
            this.filteredSearchResults = this.dishSearchResults;
            this.searchResultsType = "Dish";
        }
        else {
            if (this.searchForm.type == "Restaurant") {
                this.filterRestaurants();
                this.searchResultsType = "Restaurant";
            }
            else {
                this.filterDishes();
                this.searchResultsType = "Dish";
            }
        }
    }


    // Filtering restaurants
    private async filterRestaurants() {
        // Obtain restaurants from search service, returned restaurants are filtered with name (if not empty / null)
        await this.searchService.searchRestaurant(this.searchForm)

        let tempRestaurants: Restaurant[] = this.searchService.restaurants;

        if (this.searchForm.price == "Lowest") {
            tempRestaurants.sort((res1, res2) => res1.price - res2.price);
        }

        else if (this.searchForm.price == "Highest") {
            tempRestaurants.sort((res1, res2) => res1.price - res2.price);
        }

        this.filteredSearchResults = tempRestaurants;
    }


    // Filtering dishes
    private filterDishes() {
        let tempArray: Dish[] = [];

        this.dishSearchResults.forEach(dish => {
            if (this.searchForm.grade == null) {
                if (this.searchForm.input == "" || this.searchForm.input == null) {
                    tempArray.push(dish);
                }
                else {
                    let lcName = dish.name.toLowerCase();
                    let lcInput = this.searchForm.input.toLowerCase();

                    if (lcName.includes(lcInput)) {
                        tempArray.push(dish);
                    }
                }
            }
            else {
                if (dish.grade[3] == this.searchForm.grade) {
                    if (this.searchForm.input == "" || this.searchForm.input == null) {
                        tempArray.push(dish);
                    }
                    else {
                        let lcName = dish.name.toLowerCase();
                        let lcInput = this.searchForm.input.toLowerCase();

                        if (lcName.includes(lcInput)) {
                            tempArray.push(dish);
                        }
                    }
                }
            }
        });

        if (this.searchForm.price == "Lowest") {
            tempArray.sort((dish1, dish2) => dish1.price - dish2.price);
        }
        else if (this.searchForm.price == "Highest") {
            tempArray.sort((dish1, dish2) => dish2.price - dish1.price);
        }

        this.filteredSearchResults = tempArray;
    }

}
