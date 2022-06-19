import { Component, OnInit } from '@angular/core';
import { POST_TYPE } from 'src/app/shared/components/posts/adjustable-post/adjustable-post.component';
import { ActivityDTO, ActivityType } from 'src/app/shared/models/ActivityDTO';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
    selector: 'app-spam-browser',
    templateUrl: './spam-browser.component.html'
})
export class SpamBrowserComponent implements OnInit {

    fetchedSpam = new Array<ActivityDTO>();
    public activityTypes = ActivityType;
    public postType = POST_TYPE;

    constructor(public adminService: AdminService) { }

    async ngOnInit() {
        await this.adminService.getSpam().then((Response: Array<ActivityDTO>) => {
            if (Response != null) {
                this.fetchedSpam = Response
            }
        }, error => {
            console.error(error);
        });
    }

    isEmpty() {
        if (this.fetchedSpam == null || this.fetchedSpam.length == 0) {
            return true;
        }
        return false;
    }

    async deleteAction(id: number, type: any) {
        await this.adminService.DeleteReview(id, type);
        await this.getSpam();
    }

    async clearAction(id: number, type: any) {
        await this.adminService.ClearSpamMark(id, type);
        await this.getSpam();
    }

    async getSpam() {
        await this.adminService.getSpam().then((Response: Array<ActivityDTO>) => {
            if (Response != null) {
                this.fetchedSpam = Response
            }
        }, error => {
            console.error(error);
        });
    }

}
