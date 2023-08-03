import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTripProuctListComponent } from './view-trip-prouct-list.component';

describe('ViewTripProuctListComponent', () => {
  let component: ViewTripProuctListComponent;
  let fixture: ComponentFixture<ViewTripProuctListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTripProuctListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTripProuctListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
