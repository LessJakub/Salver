import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    host: { 'class': 'flex-auto flex flex-col justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class ErrorPageComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
