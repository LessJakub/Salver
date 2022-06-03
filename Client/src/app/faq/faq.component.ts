import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  host: {'class': 'flex-auto flex flex-col justify-center items-center'} // ! Styling host container to fill all avialable space
})
export class FAQComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
