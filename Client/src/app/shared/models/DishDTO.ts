export interface DishDTO {
    id: number;
    name: string;
    description: string;
    ingredients: string;
    appRestaurantId: number;
    price: number;
    tasteGrade: number;
    priceGrade: number;
    serviceGrade: number;
    totalGrade: number;
}