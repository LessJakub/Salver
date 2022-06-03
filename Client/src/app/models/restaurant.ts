import { GradeElement } from "./gradeElement";

export interface Restaurant {
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
