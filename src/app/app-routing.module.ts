import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, PreventGuard } from './guards/auth-guard.guard';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
      canActivate: [PreventGuard]
    },
  ], {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
