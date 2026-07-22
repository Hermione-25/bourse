import { TestBed } from '@angular/core/testing';

import { ScholarshipService } from './scholarship';

describe('ScholarshipService', () => {
  let service: ScholarshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholarshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
