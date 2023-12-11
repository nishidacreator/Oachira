import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAccountComponent } from './branch-account.component';

describe('BranchAccountComponent', () => {
  let component: BranchAccountComponent;
  let fixture: ComponentFixture<BranchAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
