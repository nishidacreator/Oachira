import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreProductsComponent } from './add-more-products.component';

describe('AddMoreProductsComponent', () => {
  let component: AddMoreProductsComponent;
  let fixture: ComponentFixture<AddMoreProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMoreProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
