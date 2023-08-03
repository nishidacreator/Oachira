import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouteDaysComponent } from './add-route-days.component';

describe('AddRouteDaysComponent', () => {
  let component: AddRouteDaysComponent;
  let fixture: ComponentFixture<AddRouteDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRouteDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRouteDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
