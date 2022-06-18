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

export enum ActivityType{
    DISH_REVIEW,
    RESTAURANT_REVIEW,
    RESTAURANT_POST,
    USER_POST
}