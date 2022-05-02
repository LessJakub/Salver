import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishOverlayComponent } from './dish-overlay.component';

describe('DishOverlayComponent', () => {
  let component: DishOverlayComponent;
  let fixture: ComponentFixture<DishOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DishOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
