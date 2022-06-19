export interface UserProfileDTO {
    id: number;
    username: string;
    verified: boolean;
    followers: number;
    followedUsers: number;
    followedRestaurants: number;
}