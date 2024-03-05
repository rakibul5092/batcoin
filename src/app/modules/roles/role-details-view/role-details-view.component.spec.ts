import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailsViewComponent } from './role-details-view.component';

describe('RoleDetailsViewComponent', () => {
  let component: RoleDetailsViewComponent;
  let fixture: ComponentFixture<RoleDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleDetailsViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
