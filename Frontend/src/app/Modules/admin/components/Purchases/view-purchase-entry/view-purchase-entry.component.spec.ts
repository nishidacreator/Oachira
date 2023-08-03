import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseEntryComponent } from './view-purchase-entry.component';

describe('ViewPurchaseEntryComponent', () => {
  let component: ViewPurchaseEntryComponent;
  let fixture: ComponentFixture<ViewPurchaseEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPurchaseEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPurchaseEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
