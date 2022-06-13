export interface ActivityDTO {
    id: number;
    type: ActivityType;
    ratings: Array<[string, number]>;
    date: Date,
    description: string,
    likes: number,
    creatorId: number,
    topicId: number
}

enum ActivityType{
    DISH_REVIEW,
    RESTAURANT_REVIEW,
    RESTAURANT_POST
}