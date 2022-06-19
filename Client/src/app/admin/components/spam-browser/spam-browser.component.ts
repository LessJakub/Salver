import { Component, OnInit } from '@angular/core';
import { ActivityDTO, ActivityType } from 'src/app/shared/models/ActivityDTO';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-spam-browser',
  templateUrl: './spam-browser.component.html',
  styleUrls: ['./spam-browser.component.css']
})
export class SpamBrowserComponent implements OnInit {

  fetchedSpam = new Array<ActivityDTO>();
  public activityTypes = ActivityType;

  constructor(public adminService: AdminService) { }

  async ngOnInit() {
    await this.adminService.getSpam().then((Response: Array<ActivityDTO>) => {
      if(Response != null)
      {
        this.fetchedSpam = Response
      }
    }, error => {
      console.error(error);
    });
  }

}
