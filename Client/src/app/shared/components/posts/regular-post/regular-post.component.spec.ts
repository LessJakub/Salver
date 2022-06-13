import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPostComponent } from './regular-post.component';

describe('RegularPostComponent', () => {
  let component: RegularPostComponent;
  let fixture: ComponentFixture<RegularPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
