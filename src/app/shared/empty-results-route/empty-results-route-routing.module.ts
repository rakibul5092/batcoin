import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyResultsRouteComponent } from './empty-results-route.component';

const routes: Routes = [{ path: '', component: EmptyResultsRouteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmptyResultsRouteRoutingModule {}
