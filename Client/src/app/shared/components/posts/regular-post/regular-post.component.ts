import { Component, Input, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/shared/models/PostDTO';

@Component({
    selector: 'app-regular-post',
    templateUrl: './regular-post.component.html',
})
export class RegularPostComponent implements OnInit {

    restaurantReview = false;
    dishReview = false;
    post = true;

    isOwner = false;

    @Input() model: PostDTO;

    postModel: PostDTO = {} as PostDTO;

    dummyPost: PostDTO = {
        id: 1,
        date: new Date(),
        likes: 14,
        description: 'Special deal for New Years Eve. This week, all meals are 50% off, with additional coupons available throughout the week. Make sure you follow our profile to obtain special deals.',
        appUserId: 0,
        appRestaurantId: 5,
        name: 'restaurant name'
    }

    restaurantName: string = "Fetched restaurant name";
    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    postImageURL: string = "";

    // model = this.dummyPost;

    updateUrlWithDefault() {

    }

    public prettyTimeFromDate(time: Date): string {
        var date = new Date(time);
        return date.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });
    }

    constructor() { }

    ngOnInit(): void {
        this.postImageURL = this.postBlobBaseURL + this.model.id + ".webp";
    }

}
