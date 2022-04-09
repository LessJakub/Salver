import { Component } from '@angular/core';
import { LoginOverlayComponent } from '../login-overlay/login-overlay.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  showLoginOverlay: Boolean

  constructor() {
    // Set to true to see login overlay
    this.showLoginOverlay = false 
  }

  
}
