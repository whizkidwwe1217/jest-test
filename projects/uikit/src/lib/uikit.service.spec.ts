import { TestBed } from '@angular/core/testing';

import { UikitService } from './uikit.service';

describe('UikitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UikitService = TestBed.get(UikitService);
    expect(service).toBeTruthy();
  });
});
