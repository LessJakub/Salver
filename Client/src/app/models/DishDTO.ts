export interface DishDTO {
    id: number;
    name: string;
    description: string;
    ingredients: string;
    appRestaurantID: number;
    price: number;
    tasteGrade: number;
    priceGrade: number;
    serviceGrade: number;
}