import { TestBed } from '@angular/core/testing';

import { SalesExecutiveService } from './sales-executive.service';

describe('SalesExecutiveService', () => {
  let service: SalesExecutiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesExecutiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
