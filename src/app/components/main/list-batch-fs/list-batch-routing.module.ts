import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListBatchFsComponent } from './list-batch-fs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListBatchFsComponent }
	])],
	exports: [RouterModule]
})
export class ListBatchFsRoutingModule { }
