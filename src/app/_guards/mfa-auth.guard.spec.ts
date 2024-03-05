import { TestBed } from '@angular/core/testing';

import { MfaAuthGuard } from './mfa-auth.guard';

describe('MfaAuthGuard', () => {
  let guard: MfaAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfaAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
