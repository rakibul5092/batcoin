import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyResultsRouteComponent } from './empty-results-route.component';

describe('EmptyResultsRouteComponent', () => {
  let component: EmptyResultsRouteComponent;
  let fixture: ComponentFixture<EmptyResultsRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyResultsRouteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyResultsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
