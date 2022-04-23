import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent implements OnInit {

    @Output() modelEvent = new EventEmitter<any>();
    
    model: any = {}

    constructor() { }

    ngOnInit(): void {}

    searchSubmitAction() {
        console.log(this.model);
        this.modelEvent.next(this.model);
    }

}
