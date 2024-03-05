import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgGridButtonsComponent } from './ag-grid.buttons.component';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('AgGridButtonsComponent', () => {
  let component: AgGridButtonsComponent;
  let fixture: ComponentFixture<AgGridButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgGridButtonsComponent],
      imports: [IonicModule.forRoot(), MatDialogModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgGridButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
