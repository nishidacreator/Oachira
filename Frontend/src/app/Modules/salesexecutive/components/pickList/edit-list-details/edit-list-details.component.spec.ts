import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListDetailsComponent } from './edit-list-details.component';

describe('EditListDetailsComponent', () => {
  let component: EditListDetailsComponent;
  let fixture: ComponentFixture<EditListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditListDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
