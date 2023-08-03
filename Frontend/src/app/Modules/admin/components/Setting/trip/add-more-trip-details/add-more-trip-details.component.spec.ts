import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreTripDetailsComponent } from './add-more-trip-details.component';

describe('AddMoreTripDetailsComponent', () => {
  let component: AddMoreTripDetailsComponent;
  let fixture: ComponentFixture<AddMoreTripDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreTripDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMoreTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
