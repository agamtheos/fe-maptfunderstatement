import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserManagementFsComponent } from './user-management-fs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserManagementFsComponent }
	])],
	exports: [RouterModule]
})
export class ListFileFsRoutingModule { }
