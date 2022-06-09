import { Time } from "@angular/common";

export interface OrderDTO {
    id: number,
    address: string,
    status: number,
    submitTime: Date,
    expectedTime: Time,
    realizationTime: Date,
    userId: number,
    restaurantId: number,
    dishesIds: number[]
}