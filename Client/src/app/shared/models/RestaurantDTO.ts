import { GradeElement } from "src/app/models/gradeElement";

export interface RestaurantDTO {
    id: number,
    name: string,
    description: string,
    address: string,
    phoneNumber: string,
    email: string,
    followers: number,
    images: string[],
    price: number,
    rating: number,
    atmosphereRating: number,
    serviceRating: number,
    priceRange: string,
    grades: GradeElement[]
}
