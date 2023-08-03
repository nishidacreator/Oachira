import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEntryManagementComponent } from './purchase-entry-management.component';

describe('PurchaseEntryManagementComponent', () => {
  let component: PurchaseEntryManagementComponent;
  let fixture: ComponentFixture<PurchaseEntryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseEntryManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseEntryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
