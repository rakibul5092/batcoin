import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from '../../_guards/admin.guard';

const routes: Routes = [
  {
    path: 'cms',
    loadChildren: () => import('../cms/cms.module').then((m) => m.CmsModule),
  },
  {
    path: 'products',
    loadChildren: () => import('../products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'orders',
    loadChildren: () => import('../orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'statuses',
    loadChildren: () => import('../order_statuses/statuses.module').then((m) => m.StatusesModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('../contact_queries/queries.module').then((m) => m.QueriesModule),
  },
  {
    path: 'roles',
    canActivate: [AdminGuard],
    loadChildren: () => import('../roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'users',
    canActivate: [AdminGuard],
    loadChildren: () => import('../users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'messages',
    loadChildren: () => import('../notification_messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
