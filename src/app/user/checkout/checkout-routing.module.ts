import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutPage } from './checkout.page';
import { CongratulationsComponent } from './congratulations/congratulations.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage,
  },
  {
    path: 'congratulations',
    component: CongratulationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule {}
