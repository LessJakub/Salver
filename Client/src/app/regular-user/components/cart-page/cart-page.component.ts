import { Component, OnInit } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class CartPageComponent implements OnInit {

  constructor(private searchService: SearchService,
              private orderService: OrdersService) { }

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
          if (dish.appRestaurantId == this.orderService.currentRestaurant 
            && -1 == this.orderService.dishesInOrder.findIndex(d => d.id == dish.id))
          {
            this.recommendations.push(dish);
            usedIDs.push(dish.appRestaurantId);
          }
          else if (this.orderService.currentRestaurant == 0 && dish.appRestaurantId != NaN)
          {
            if (usedIDs.includes(dish.appRestaurantId) == false) {
              this.recommendations.push(dish);
              usedIDs.push(dish.appRestaurantId);
          }
          }
                
        })
    }
}

  ngOnInit(): void {
    this.generateRecommendations();
    this.orderService.dishesInCartLength.subscribe((Resp:number) => {
      this.recommendations = [];
      this.generateRecommendations();
    }, error =>{
      console.error(error)
    })
  }

}
