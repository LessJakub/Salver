import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { 'class' : 'flex flex-col grow'}
})

export class AppComponent implements OnInit {

  constructor(private metaService:Meta) {}

  ngOnInit() {
  }
}