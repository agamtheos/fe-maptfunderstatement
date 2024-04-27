import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthGuard, PreventGuard} from './guards/auth-guard.guard';
import {AppLayoutComponent} from './layouts/app.layout.component';
import {NotfoundComponent} from './components/notfound/notfound.component';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '', redirectTo: 'auth/login', pathMatch: 'full'
    },
    {
      path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
      canActivate: [PreventGuard]
    },
    {
      path: 'main', component: AppLayoutComponent,
      children: [
        {
          path: 'batch-fs',
          loadChildren: () => import('./components/main/list-batch-fs/list-batch-fs.module').then(m => m.ListBatchFsModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'file-fs/:id',
          loadChildren: () => import('./components/main/list-file-fs/list-file-fs.module').then(m => m.ListFileFsModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'blacklist-funder',
          loadChildren: () => import('./components/main/blacklist-funder/blacklist-funder.module').then(m => m.BlacklistFunderModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'user-management',
          loadChildren: () => import('./components/main/user-management/user-management.module').then(m => m.UserManagementModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'menu-management',
          loadChildren: () => import('./components/main/menu-management/menu-management.module').then(m => m.MenuManagementModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'role-management',
          loadChildren: () => import('./components/main/role-management/role-management.module').then(m => m.RoleManagementModule),
          canActivate: [AuthGuard]
        },
      ]
    },
    {path: 'notfound', component: NotfoundComponent},
    {path: '**', redirectTo: '/notfound'}
  ], {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
