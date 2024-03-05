import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageViaUrlComponent } from './add-image-via-url.component';

describe('AddImageViaUrlComponent', () => {
  let component: AddImageViaUrlComponent;
  let fixture: ComponentFixture<AddImageViaUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddImageViaUrlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddImageViaUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
