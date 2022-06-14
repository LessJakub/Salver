import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';

@Component({
    selector: 'app-add-rest-post',
    templateUrl: './add-rest-post.component.html',
})
export class AddRestPostComponent implements OnInit {

    constructor() { }

    @Input() model: RestaurantDTO;
    @Output() reloadEventEmitter = new EventEmitter();

    enabled = false;

    currentDate = new Date();

    enableAction() {
        this.enabled = true;
    }

    cancelAction() {
        this.enabled = false;
    }

    ngOnInit(): void {
    }

    invertOverlayFlag() {
        this.showOverlay = !this.showOverlay;
    }
    
    disableLoginOverlay(eventFlag: boolean) {
        this.showOverlay = eventFlag;
    }

    handleReload(flag: boolean) {
        console.log("Handle reload:", flag);
        if (flag == true) {
            this.reloadEventEmitter.emit(true);
        }
    }

    showOverlay: boolean = false;

    adderAction() {
        console.log("Add new dish action");
    }

    public prettyTimeFromDate(time: Date): string {
        var date = new Date(time);
        return date.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });
    }
}
