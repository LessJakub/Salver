import { Time } from "@angular/common";

enum Status 
    {
        NEW,
        IN_PROGRESS,
        CANCELLED,
        FINISHED
    }

export interface OrderDTO {
    id: number,
    address: string,
    status: Status,
    submitTime: Date,
    expectedTime: Time,
    realizationTime: Date,
    userId: number,
    restaurantId: number,
    dishesIds: number[]
}