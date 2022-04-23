import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Dish } from '../models/Dish';
import { SearchTileComponent } from './search-tile/search-tile.component';

@Component({
  selector: 'app-search-page',
  host: {'class': 'grow flex items-center'},
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

    searchForm: any = null;

    filteredSearchResults: any[];

    dishSearchResults: Dish[] = [
        {name:"Hosomaki", imageURL:"/assets/images/3W2A0606.webp", grade:2, description:"With fresh mango or tuna. 6 pcs",price:15},
        {name:"Uramaki",  imageURL:"/assets/images/3W2A0699.webp", grade:3, description:"Avocado uramaki with soy sauce.", price:20},
        {name:"Curry & Shrimps", imageURL:"/assets/images/W2A6423.webp",  grade:5, description:"Green curry with shrimps, vegetables and jasmin rice", price:23},
        {name:"Fried Ice-Cream", imageURL:"/assets/images/W2A6500.webp", grade:5, description:"Fried ice cream with mango pulp", price:17},
        {name:"Fusion Rolls", imageURL:"/assets/images/W2A6389.webp", grade:4, description:"Salmon marinated in togarashi, avocado, mango sauce, micro greens", price:24},
        {name:"Sashimi", imageURL:"/assets/images/3W2A0746.webp", grade:3, description:"Salmon, tuna, butterfish, 12 pcs", price:35},
        {name:"Wakame Salad", imageURL:"/assets/images/3W2A0956.webp", grade:5, description:"Seaweed, sesame seeds, cucumber, rice vinegar", price:29},
        {name:"Tom Yam Kung ", imageURL:"/assets/images/3W2A0925.webp", grade:5, description:"Thai soup with shrimps, coconut milk and vegetables", price:26},
    ]

    constructor() {}

    ngOnInit(): void {
        this.updateFilteredArray();
    }

    updateSearchForm(newForm: any) {
        this.searchForm = newForm;
        this.updateFilteredArray();
    }

    updateFilteredArray() {
        if (this.searchForm === null) {
            this.filteredSearchResults = this.dishSearchResults;
        }
        else {
            if (this.searchForm.type === "Restaurant") {
                this.filteredSearchResults = null;
            }
            else {
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
                        if (dish.grade == this.searchForm.grade) {
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
    }

}
