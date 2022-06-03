import { GradeElement } from "./gradeElement";

export interface Restaurant {
    name: string,
    images: string[],
    address: string,
    description: string,
    priceRange: string,
    grades: GradeElement[]
}
