import { GradeElement } from "./gradeElement"

export interface Post {
    imageURL: string,
    user: string, //will need to be elaborated later
    date: Date,
    taggedRestaurant: string, //will need to be elaborated later
    taggedRestaurantId: number
    likes: number,
    description: string,
    grades: GradeElement[]
}