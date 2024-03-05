import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthPage } from 'nextsapien-component-lib';

import { AuthGuard } from './_guards/auth.guard';
import { AdminPage } from './modules/admin/admin.page';
import { UserPage } from './user/user.page';

import { UserGuard } from './_guards/user.guard';
import { UnderConstructionComponent } from './user/under-construction/under-construction.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminPage,
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminPageModule),
  },
  {
    path: 'auth',
    component: AuthPage,
    loadChildren: () => import('nextsapien-component-lib').then((m) => m.AuthPageModule),
  },
  {
    path: '404',
    loadChildren: () => import('./shared/empty-results-route/empty-results-route.module').then((m) => m.EmptyResultsRouteModule),
  },
  {
    path: '',
    component: UserPage,
    loadChildren: () => import('./user/user.module').then((m) => m.UserPageModule),
    canActivate: [UserGuard],
  },
  {
    path: 'under-construction',
    component: UnderConstructionComponent,
  },
  {
    path: '**',
    redirectTo: 'admin',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
