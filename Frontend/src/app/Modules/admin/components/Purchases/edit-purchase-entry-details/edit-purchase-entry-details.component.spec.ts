import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseEntryDetailsComponent } from './edit-purchase-entry-details.component';

describe('EditPurchaseEntryDetailsComponent', () => {
  let component: EditPurchaseEntryDetailsComponent;
  let fixture: ComponentFixture<EditPurchaseEntryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPurchaseEntryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPurchaseEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
