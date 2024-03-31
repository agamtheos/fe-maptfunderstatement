import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IListBatchFs } from 'src/app/interfaces/i-list-batch-fs';

@Component({
  selector: 'app-list-batch-fs',
  templateUrl: './list-batch-fs.component.html',
  styleUrl: './list-batch-fs.component.scss'
})
export class ListBatchFsComponent {
  deleteBatchsDialog: boolean = false;

  deleteBatchDialog: boolean = false;

  batchs: IListBatchFs[] = [];

  batch: IListBatchFs = {};

  selectedBatchs: IListBatchFs[] = [];

  cols: any[] = [];

  statuses: any[] = [];


}
