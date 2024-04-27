import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RoleManagementFsComponent} from './role-management-fs.component';

@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: RoleManagementFsComponent}
  ])],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule {
}
