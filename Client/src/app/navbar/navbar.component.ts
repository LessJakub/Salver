import { Component, OnInit } from '@angular/core';
import { Section } from '../Section';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
      // Called shortly after constructor, good place for init logic
  }

  sectionsList: Section[] = [
      {name: "About us"},
      {name: "Team"},
      {name: "FAQ"}
  ]

}
