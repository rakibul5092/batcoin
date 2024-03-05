import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyResultsRouteRoutingModule } from './empty-results-route-routing.module';
import { EmptyResultsRouteComponent } from './empty-results-route.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [EmptyResultsRouteComponent],
  imports: [CommonModule, IonicModule, TranslateModule, EmptyResultsRouteRoutingModule],
})
export class EmptyResultsRouteModule {}
