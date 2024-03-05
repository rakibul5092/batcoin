import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AgGridToggleComponent } from './ag-grid-toggle/ag-grid-toggle.component';
import { AgGridButtonsComponent } from './ag-grid-buttons/ag-grid.buttons.component';
import { AgGridService } from './ag-grid.service';
import { AgGridMarkreadComponent } from './ag-grid-markread/ag-grid-markread.component';

@NgModule({
  declarations: [AgGridToggleComponent, AgGridButtonsComponent, AgGridMarkreadComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltipModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [AgGridToggleComponent, AgGridButtonsComponent, AgGridMarkreadComponent],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    AgGridService,
  ],
})
export class AgGridModule {}
