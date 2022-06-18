import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityDTO, ActivityType } from '../../models/ActivityDTO';
import { DishDTO } from '../../models/DishDTO';
import { PostDTO } from '../../models/PostDTO';
import { AccountService } from '../../services/account.service';
import { ActivityService } from '../../services/activity.service';
import { BlobUploadService } from '../../services/blob-upload.service';
import { ReviewsService } from '../../services/reviews.service';
import { SearchService } from '../../services/search.service';
import { POST_TYPE } from '../posts/adjustable-post/adjustable-post.component';

import { UserProfileDTO } from "../../models/UserProfileDTO"
import { ProfileService } from "../../services/profile.service"


@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class UserPageComponent implements OnInit {

    public postTypes = POST_TYPE;
    public activityTypes = ActivityType;

    profileImageURL: string;

    fetchedDishes: DishDTO[] = null;
    fetchedPosts: PostDTO[] = null;
    fetchedActivity: ActivityDTO[] = null;

    isFollowing: boolean = false;
    followButtonText = this.isFollowing ? "Unfollow" : "Follow";

    constructor(private activatedRoute: ActivatedRoute,
        private searchService: SearchService,
        private uploadService: BlobUploadService,
        public accountService: AccountService,
        private reviewsService: ReviewsService,
        public activityService: ActivityService,
        private router: Router,
        private profileService: ProfileService) { }


    user = this.accountService.currentUser$;

    updateData(eventFlag: boolean) {
        console.log("Obtained event:", eventFlag);
        if (eventFlag == true) {
            this.getActivity();
        }
    }

    handleRestReviewReload() {
        // this.getDetails();
    }

    updateUrlWithDefault() {
        this.profileImageURL = this.uploadService.defaultRestaurantImageURL();
    }


    selectedTabID: number = 0;

    async followButtonAction() {
        console.log("Is following: " + this.isFollowing);
        if (!this.isFollowing) {
            console.log("Follow action");
            await this.profileService.followUser(this.userPageID).then((response) => {
                this.isFollowing = true;
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }
        else {
            console.log("Unfollow action");
            await this.profileService.unfollowUser(this.userPageID).then((response) => {
                this.isFollowing = false;
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }

        this.getProfileDetails();
    }

    selectNewTab(selectedID: number) {
        this.selectedTabID = selectedID;
        switch (this.selectedTabID) {
            case 0:
                this.getActivity();
                return;
            case 1:
                this.getPosts();
                return;
            case 2:
                this.getActivity();
                return;
        }
    }

    private async getDishes() {
        console.log("Restaurant - Dishes Getter");
        // this.fetchedDishes = await this.searchService.searchDishesByID(this.restaurantID);
    }

    private async getPosts() {
        console.log("Restaurant - Posts Getter");
        // this.fetchedPosts = await this.reviewsService.getRestaurantPosts(this.restaurantID);
    }

    private async getActivity() {
        console.log("Restaurant - Activity Getter")
        this.fetchedActivity = await this.profileService.getUserActivity(this.userPageID);
    }

    uploadFiles(files) {
        console.log("Upload service - Upload files")
        const formData = new FormData();

        if (files[0]) {
            var filename = this.profileModel.id + ".webp"
            console.log(filename)
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", filename)
            formData.append("blobContainer", "resprof");

            this.uploadService
                .upload(formData)
                .subscribe(({ path }) => (console.log(path)));
        }
        else {
            console.log("Upload service - Files empty");
        }
    }

    userPageID: number;
    loggedUserID: number;
    isProfileOwner: boolean;

    countEndings: string[] = ["", ""]

    evaluateIfPlural() {
        this.countEndings[0] = this.profileModel.followedUsers == 1 ? "" : "s"
        this.countEndings[1] = this.profileModel.followedRestaurants == 1 ? "" : "s"
    }

    userProfBlobBaseURL = "https://salver.blob.core.windows.net/userprof/";

    profileModel: UserProfileDTO;


    async getProfileDetails() {
        await this.profileService.getUserProfile(this.userPageID).then((profile) => {
            if (profile != null) {
                this.profileModel = profile;
            }
        })

        if (this.profileModel == null) {
            this.router.navigate(['*']);
        }

        this.isProfileOwner = (this.userPageID == this.loggedUserID);
        this.profileImageURL = this.userProfBlobBaseURL + this.userPageID + ".webp"
        this.isFollowing = await this.profileService.followsUser(this.userPageID);
        this.followButtonText = this.isFollowing ? "Unfollow" : "Follow";

        this.evaluateIfPlural();
    }

    async ngOnInit() {
        console.log("Using ID from ActivatedRoute");
        // Obtain user ID from ActivatedRouter.
        this.userPageID = this.activatedRoute.snapshot.params['id'];

        if (this.userPageID == null || this.userPageID == NaN) {
            this.router.navigate(['*']);
        }

        if(this.accountService.currentUser$ != null)
        {
            this.accountService.currentUser$.subscribe((usr) => {
                if(usr != null)
                {
                    this.loggedUserID = usr.id;
                } 
            });
        }

        await this.getProfileDetails();
    }

}
