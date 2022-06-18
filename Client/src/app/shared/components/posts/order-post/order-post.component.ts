import { Component, Input, OnInit } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { OrderDTO, Status } from 'src/app/shared/models/OrderDTO';
import { OrdersManagementService } from 'src/app/shared/services/orders-management.service';

@Component({
    selector: 'app-order-post',
    templateUrl: './order-post.component.html',
})
export class OrderPostComponent implements OnInit {

    public statusType = Status;

    @Input() model: OrderDTO = null;
    fetchedDishes: Array<[DishDTO, number]> = new Array<[DishDTO, number]>();
    
    constructor(private managementService: OrdersManagementService) { }

    ngOnInit(): void {
        this.fetchDishTuples();
    }

    public prettyTimeFromDate(time: Date): string {
        var date = new Date(time);
        return date.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async fetchDishTuples() {
        this.fetchedDishes = await this.managementService.GetDishesFromList(this.model.dishesIds);
    }

    async cancelButtonAction() {
        await this.managementService.CancelOrder(this.model.id);
    }

    async acceptButtonAction() {
        await this.managementService.AcceptOrder(this.model.id);
    }

    async finishButtonAction() {
        await this.managementService.FinishOrder(this.model.id);
    }

}
