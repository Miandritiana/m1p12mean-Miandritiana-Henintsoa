import { TestBed } from '@angular/core/testing';

import { CrudPrestationService } from './crud-prestation.service';

describe('CrudPrestationService', () => {
  let service: CrudPrestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPrestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
