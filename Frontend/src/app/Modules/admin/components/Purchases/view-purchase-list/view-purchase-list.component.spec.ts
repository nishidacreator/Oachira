import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseListComponent } from './view-purchase-list.component';

describe('ViewPurchaseListComponent', () => {
  let component: ViewPurchaseListComponent;
  let fixture: ComponentFixture<ViewPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPurchaseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
