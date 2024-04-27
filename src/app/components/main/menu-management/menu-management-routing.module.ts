import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuManagementFsComponent} from './menu-management-fs.component';

@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: MenuManagementFsComponent}
  ])],
  exports: [RouterModule]
})
export class MenuManagementRoutingModule {
}
