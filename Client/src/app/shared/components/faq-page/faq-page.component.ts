import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-faq-page',
    templateUrl: './faq-page.component.html',
    host: { 'class': 'flex-auto flex flex-col justify-center items-center' } // ! Styling host container to fill all avialable space
})

export class FaqPageComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
