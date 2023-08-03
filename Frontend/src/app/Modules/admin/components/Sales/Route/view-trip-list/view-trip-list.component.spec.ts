import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTripListComponent } from './view-trip-list.component';

describe('ViewTripListComponent', () => {
  let component: ViewTripListComponent;
  let fixture: ComponentFixture<ViewTripListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTripListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
