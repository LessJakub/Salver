import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DishReviewDTO } from 'src/app/shared/models/DishReviewDTO';

@Component({
    selector: 'app-review-post',
    templateUrl: './review-post.component.html',
})
export class ReviewPostComponent implements OnInit {

    @Input() model: DishReviewDTO;
    @Input() isOwner: boolean = false;
    @Output() reloadEventEmitter = new EventEmitter();

    constructor() { }

    ngOnInit(): void { }

}
