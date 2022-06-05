import { GradeElement } from "src/app/models/gradeElement";

export interface RestaurantDTO {
    id: number,
    name: string,
    description: string,
    address: string,
    images: string[],
    price: number,
    rating: number,
    priceRange: string,
    grades: GradeElement[]
}
