import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { SearchForm } from 'src/app/models/SearchForm';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class SearchPageComponent implements OnInit {

    searchForm: SearchForm;

    filteredSearchResults: any[] = [];
    searchResultsType: string = "Dish";
    /*
    dishSearchResults: Dish[] = [
        { name: "Hosomaki", imageURL: ["/assets/images/3W2A0606@0.5x.webp", "/assets/images/3W2A0606@0.5x.webp"], grade: [4, 2, 3, 3], description: "With fresh mango or tuna. 6 pcs", price: 15, restaurant: "Japan Sun" },
        { name: "Uramaki", imageURL: ["/assets/images/3W2A0699@0.5x.webp", "/assets/images/3W2A0699@0.5x.webp"], grade: [5, 3, 5, 4], description: "Avocado uramaki with soy sauce.", price: 20, restaurant: "Japan Sun" },

        {
            name: "Curry & Shrimps", imageURL: ["/assets/images/W2A6423@0.5x.webp", "/assets/images/W2A6423@0.5x.webp"], grade: [5, 5, 4, 5],
            description: "Green curry with shrimps, vegetables and jasmin rice. Decorated with edible flowers and coriander. Ideal dish for shrimp-lovers but not only. This is a dummy text which i had to add because im not very creative and i had no idea what to write in the description apart from the ingredients list",
            price: 23, restaurant: "Japan Sun"
        },

        { name: "Fried Ice-Cream", imageURL: ["/assets/images/W2A6500@0.5x.webp", "/assets/images/W2A6500@0.5x.webp"], grade: [4, 3, 2, 3], description: "Fried ice cream with mango pulp", price: 17, restaurant: "Japan Sun" },
        { name: "Fusion Rolls", imageURL: ["/assets/images/W2A6389@0.5x.webp"], grade: [4, 3, 2, 4], description: "Salmon marinated in togarashi, avocado, mango sauce, micro greens", price: 24, restaurant: "Japan Sun" },
        { name: "Sashimi", imageURL: ["/assets/images/3W2A0746@0.5x.webp"], grade: [3, 1, 2, 3], description: "Salmon, tuna, butterfish, 12 pcs", price: 35, restaurant: "Japan Sun" },
        { name: "Wakame Salad", imageURL: ["/assets/images/3W2A0956@0.5x.webp"], grade: [5, 4, 5, 5], description: "Seaweed, sesame seeds, cucumber, rice vinegar", price: 29, restaurant: "Japan Sun" },
        { name: "Tom Yam Kung ", imageURL: ["/assets/images/3W2A0925@0.5x.webp"], grade: [5, 3, 4, 4], description: "Thai soup with shrimps, coconut milk and vegetables", price: 26, restaurant: "Japan Sun" },
    ]
*/
    constructor(private searchService: SearchService) { }

    fetchItemCount = 12;

    async onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            // This check fixes duplicate issue when switching search from while having container scrolled down.
            // This function runs together with the one from changing form, so it leads to duplicates for first fetch batch.
            // By checking if length == 0 we detect if new search was ran.
            if (this.filteredSearchResults.length != 0) {
                await this.updateFilteredArray();
            }
        }
    }

    async ngOnInit() {
        await this.updateFilteredArray();
    }

    async updateSearchForm(newForm: SearchForm) {
        this.searchForm = newForm;
        this.filteredSearchResults = []
        await this.updateFilteredArray();
    }

    async updateFilteredArray() {
        if (this.searchForm == null) {
            await this.filterDishes();
            this.searchResultsType = "Dish";
        }
        else {
            if (this.searchForm.type == "Restaurant") {
                await this.filterRestaurants();
                this.searchResultsType = "Restaurant";
            }
            else if (this.searchForm.type == "Dish")  {
                await this.filterDishes();
                this.searchResultsType = "Dish";
            }
        }
    }


    // Filtering restaurants
    private async filterRestaurants() {
        // Obtain restaurants from search service, returned restaurants are filtered with name (if not empty / null)
        await this.searchService.searchRestaurant(this.searchForm, this.filteredSearchResults.length, this.fetchItemCount)

        let tempArray: RestaurantDTO[] = this.searchService.restaurants;

        this.filteredSearchResults = [...this.filteredSearchResults, ...tempArray];

        var unique = this.filteredSearchResults.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        })

        if (this.searchForm != null && this.searchForm.price != null) {
            if (this.searchForm.price == "Lowest") {
                this.filteredSearchResults = this.filteredSearchResults.sort((res1, res2) => res1.price - res2.price);
            }
            else if (this.searchForm.price == "Highest") {
                this.filteredSearchResults = this.filteredSearchResults.sort((res1, res2) => res2.price - res1.price);
            }
        }
    }


    // Filtering dishes
    private async filterDishes() {

        // Obtain restaurants from search service, returned restaurants are filtered with name (if not empty / null)
        await this.searchService.searchDishes(this.searchForm, this.filteredSearchResults.length, this.fetchItemCount);

        let tempArray: DishDTO[] = this.searchService.dishes;
        this.filteredSearchResults = [...this.filteredSearchResults, ...tempArray];

        var unique = this.filteredSearchResults.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        })

        if (this.searchForm != null && this.searchForm.price != null) {
            if (this.searchForm.price == "Lowest") {
                this.filteredSearchResults = this.filteredSearchResults.sort((dish1, dish2) => dish1.price - dish2.price);
            }
            else if (this.searchForm.price == "Highest") {
                this.filteredSearchResults = this.filteredSearchResults.sort((dish1, dish2) => dish2.price - dish1.price);
            }
        }
    }
}
