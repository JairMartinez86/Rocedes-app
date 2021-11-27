import { TestBed } from '@angular/core/testing';

import { BundleBoningService } from './bundle-boxing.service';

describe('BundleBoningService', () => {
  let service: BundleBoningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BundleBoningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
