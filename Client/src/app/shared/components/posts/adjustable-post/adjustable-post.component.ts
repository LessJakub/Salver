import { Component, Input, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { SearchService } from 'src/app/shared/services/search.service';

export enum POST_TYPE {
    REST_REVIEW = 0,
    DISH_REVIEW = 1,
    REGULAR_POST = 2
}

@Component({
    selector: 'app-adjustable-post',
    templateUrl: './adjustable-post.component.html',
})
export class AdjustablePostComponent implements OnInit {

    @Input() public type: POST_TYPE = POST_TYPE.REGULAR_POST;
    @Input() model: PostDTO;

    isOwner = false;

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    routerLink: string = '';
    postImageURL: string = "";
    creatorName: string = '';

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

    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.postImageURL = this.postBlobBaseURL + this.model.id + ".webp";
        //If post was created by restaurant
        if(this.model.appRestaurantId != 0) 
        {
            this.routerLink = '/restaurant/' + this.model.appRestaurantId
            this.creatorName = this.model.name
        }
        else
        {
            this.routerLink = '/activity/'
            this.creatorName = this.model.username
        }
    }

}
