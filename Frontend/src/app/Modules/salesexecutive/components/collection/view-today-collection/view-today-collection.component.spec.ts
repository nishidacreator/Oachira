import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTodayCollectionComponent } from './view-today-collection.component';

describe('ViewTodayCollectionComponent', () => {
  let component: ViewTodayCollectionComponent;
  let fixture: ComponentFixture<ViewTodayCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTodayCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTodayCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
