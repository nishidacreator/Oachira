import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseEntryComponent } from './add-purchase-entry.component';

describe('PurchaseEntryManagementComponent', () => {
  let component: AddPurchaseEntryComponent;
  let fixture: ComponentFixture<AddPurchaseEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
