import { Component, OnInit, Input } from '@angular/core';

import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post',
  host: {'class': 'flex grow justify-center h-full w-full'}, // ! Styling host container to fill all avialable space
  template: `
    <div class="rounded-2xl shadow-xl flex w-full h-96 max-w-3xl bg-white">
      <!-- Post image -->
      <img src={{model.imageURL}} class="h-full object-contain rounded-tl-2xl rounded-bl-2xl ">

      <!-- Post text area-->
      <div class="flex flex-col w-full h-full px-3 py-4 justify-between relative">
        <div class="grow min-h-0 flex flex-col">
          <div class="mb-3">
            <h3 class="text-xl">{{ model.user }}</h3>
            <p> {{ prettyTimeFromDate(model.date) }}</p>
          </div>
          <p class="text-green-600 font-medium mb-3"> {{ model.taggedRestaurant }}</p>
          <p class="grow overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:h-10 after:w-full after:bg-gradient-to-t after:from-white">
            {{ model.description }} <!-- Too long desc just overflow and are hidden, there is a fade out effect on the bottom of the desc. text area -->
          </p>
        </div>

        <!-- Post grades -->
        <div class="pt-4 w-3/4 space-y-1">
          <!-- The additional divs are necessary due to h-full and w-full set on grade-component -->
          <div *ngFor="let elem of model.grades">
            <app-grade-component [grade]="elem.grade" [name]="elem.category"></app-grade-component>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PostComponent implements OnInit {

  @Input() model: Post;

  constructor() { }

  ngOnInit(): void {
  }

  prettyTimeFromDate(time: Date): string {
    return time.toLocaleDateString(navigator.language, {
      year: '2-digit',
      month:'2-digit',
      day:  '2-digit',
    });
  }

}
