import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripProductDetailsComponent } from './trip-product-details.component';

describe('TripProductDetailsComponent', () => {
  let component: TripProductDetailsComponent;
  let fixture: ComponentFixture<TripProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
