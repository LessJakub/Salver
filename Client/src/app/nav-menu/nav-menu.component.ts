import { Component } from '@angular/core';
import { LoginOverlayComponent } from '../login-overlay/login-overlay.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  host: {'class': 'sticky top-0'},
})
export class NavMenuComponent {

  showLoginOverlay: Boolean

    constructor() {
    // Set to true to see login overlay
        this.showLoginOverlay = false
    }

    enableLoginOverlay() {
        this.showLoginOverlay = true
  }

    disableLoginOverlay(eventFlag:boolean) {
        this.showLoginOverlay = eventFlag;
    }

  
}
