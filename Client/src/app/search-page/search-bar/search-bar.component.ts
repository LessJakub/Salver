import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchForm } from 'src/app/models/SearchForm';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent implements OnInit {

    @Output() modelEvent = new EventEmitter<SearchForm>();

    model: SearchForm = {
        input: null,
        type: null,
        grade: null,
        price: null,
    }

    constructor() { }

    ngOnInit(): void {}

    searchSubmitAction() {
        console.log(this.model);
        this.modelEvent.next(this.model);
    }

}
