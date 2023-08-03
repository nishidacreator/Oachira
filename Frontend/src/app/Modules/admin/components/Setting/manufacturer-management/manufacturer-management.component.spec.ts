import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerManagementComponent } from './manufacturer-management.component';

describe('ManufacturerManagementComponent', () => {
  let component: ManufacturerManagementComponent;
  let fixture: ComponentFixture<ManufacturerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
