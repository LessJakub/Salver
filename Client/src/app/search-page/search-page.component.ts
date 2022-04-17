import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-page',
  host: {'class': 'grow flex items-center'},
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
