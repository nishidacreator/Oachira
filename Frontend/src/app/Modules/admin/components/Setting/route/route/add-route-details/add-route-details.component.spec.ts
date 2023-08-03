import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouteDetailsComponent } from './add-route-details.component';

describe('AddRouteDetailsComponent', () => {
  let component: AddRouteDetailsComponent;
  let fixture: ComponentFixture<AddRouteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRouteDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
