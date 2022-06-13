import { Component, Input, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { SearchService } from 'src/app/shared/services/search.service';

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

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    postImageURL: string = "";

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
    }

}
