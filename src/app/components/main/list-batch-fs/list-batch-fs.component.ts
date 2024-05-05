import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';

import {IListBatchFs} from 'src/app/interfaces/i-list-batch-fs';
import {AuthService} from 'src/app/services';
import {ListBatchFsService} from 'src/app/services/list-batch-fs.service';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-list-batch-fs',
  templateUrl: './list-batch-fs.component.html',
  styleUrl: './list-batch-fs.component.scss',
  providers: [MessageService]
})
export class ListBatchFsComponent {
  role: string = '';

  templates: any[] = [];

  selectedTemplateId: number = 0;

  filteredTemplates: any[] = [];

  batchDialog: boolean = false;

  deleteBatchsDialog: boolean = false;

  deleteBatchDialog: boolean = false;

  approveBatchsDialog: boolean = false;

  rejectBatchsDialog: boolean = false;

  batchs: IListBatchFs[] = [];

  batch: IListBatchFs = {};

  selectedBatchs: IListBatchFs[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowPerPageOptions: number[] = [5, 10, 25, 50, 100];

  maxFileSize: number = 1000000;

  selectedTemplateAdvanced: any[] = [];

  multipartFile: any = null;

  multipleDeleteIds: string[] = [];

  loading: boolean = false;

  selectAll: boolean = false;

  totalBatchs: number = 0;

  sortField: string = 'createdAt';

  constructor(
    private messageService: MessageService,
    private listBatchFsService: ListBatchFsService,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    const role = JSON.parse(this.utilService.getLocalStorageItem('role')!);
    this.role = role.roleName;

    this.cols = [
      {field: 'batchName', header: 'Nama'},
      {field: 'status', header: 'Status'},
      {field: 'totalFunderFile', header: 'Total File'},
      {field: 'totalSent', header: 'Total Terkirim'},
      {field: 'totalRejected', header: 'Total Ditolak'},
      {field: 'totalBlacklisted', header: 'Total Blacklisted'},
      {field: 'createdBy', header: 'Dibuat Oleh'},
      {field: 'createdAt', header: 'Dibuat Pada'}
    ];

    this.statuses = [
      {label: 'ON PROCESS', value: 'onprocess'},
      {label: 'READY', value: 'ready'},
      {label: 'FAILED', value: 'failed'},
      {label: 'REJECTED', value: 'rejected'},
      {label: 'REVIEWED', value: 'reviewed'},
    ];
  }

  loadBatchs(event?: any) {
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'ascc';
    let sortBy: string = 'createdAt';

    if (event) {
      if (event.first === 0) {
        page = event.first;
      } else {
        page = event.first / event.rows;
      }

      size = event.rows;
      sort = event.sortOrder === 1 ? 'desc' : 'asc';
      sortBy = event.sortField
    }

    this.listBatchFsService.getListBatchFs(page, sort, sortBy, size)
      .subscribe(
        (response) => {
          this.batchs = response.data.content;
          this.totalBatchs = response.data.totalItems;
          this.loading = false;
        }
      )
  }

  onSelectionChange(event: any) {
    this.multipleDeleteIds = [];
    for (let i = 0; i < event.length; i++) {
      this.multipleDeleteIds.push(event[i].funderStatementBatchId)
    }
  }

  onGetFile(event: any) {
    let fd = new FormData();
    fd.append('file', event.files[0]);
    this.multipartFile = fd;
  }

  uploadBatchFile() {
    this.submitted = true;

    if (this.selectedTemplateId === 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Silahkan pilih template!', life: 3000});
      return;
    }

    if (this.multipartFile === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Silahkan pilih file yang akan diupload!',
        life: 3000
      });
      return;
    }

    this.listBatchFsService.uploadBatch(this.multipartFile, this.selectedTemplateId)
      .subscribe({
        next: (response) => {

        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
        }
      });

    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Batch Uploaded', life: 3000});
    this.batchDialog = false;
    this.multipartFile = null;
    this.selectedTemplateId = 0;
    this.filteredTemplates = [];
    this.selectedTemplateAdvanced = [];

    // create pendiinig task 1 seconds
    setTimeout(() => {
      this.listBatchFsService.getListBatchFs(0, 'desc', 'createdAt', 10)
        .subscribe(
          (response) => {
            this.batchs = response.data.content;
          }
        )
    }, 2000);
  }

  onSelectedTemplate(event: any) {
    this.selectedTemplateId = event.value.funderStatementTemplateId;
  }

  onUnselectedFile(event: any) {
    this.multipartFile = null;
  }

  filterTemplate(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.templates.length; i++) {
      const template = this.templates[i];
      if (template.templateName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(template);
      }
    }

    this.filteredTemplates = filtered;
  }

  uploadBatch() {
    this.batch = {};
    this.submitted = false;
    this.batchDialog = true;

    this.listBatchFsService.getAllTemplateByName()
      .subscribe(
        (response) => {
          this.templates = response.data;
        }
      )
  }

  approveBatch() {
    for (let i = 0; i < this.selectedBatchs.length; i++) {
      this.multipleDeleteIds.push(this.selectedBatchs[i].funderStatementBatchId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.listBatchFsService.approveBatch(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menyetujui Batch!',
            life: 3000
          });
          this.selectedBatchs = [];
          this.loadBatchs()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadBatchs()
        }
      });
    this.approveBatchsDialog = false;
  }

  rejectBatch() {
    for (let i = 0; i < this.selectedBatchs.length; i++) {
      this.multipleDeleteIds.push(this.selectedBatchs[i].funderStatementBatchId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.listBatchFsService.rejectBatch(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menolak Batch!',
            life: 3000
          });
          this.selectedBatchs = [];
          this.loadBatchs()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadBatchs()
        }
      });
    this.rejectBatchsDialog = false;
  }

  deleteSelectedBatchs() {
    for (let i = 0; i < this.selectedBatchs.length; i++) {
      this.multipleDeleteIds.push(this.selectedBatchs[i].funderStatementBatchId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.listBatchFsService.multipleDelete(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Batch!',
            life: 3000
          });
          this.batchs = this.batchs.filter(val => !this.selectedBatchs.includes(val));
          this.selectedBatchs = [];
          this.loadBatchs()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadBatchs()
        }
      });

    this.deleteBatchsDialog = false;
  }

  onRowSelected(event: any) {
    console.log(event)
  }

  deleteConfirmDialog() {
    this.deleteBatchsDialog = true
  }

  approveConfirmDialog() {
    this.approveBatchsDialog = true
  }

  rejectConfirmDialog() {
    this.rejectBatchsDialog = true
  }

  deleteBatch(batch: IListBatchFs) {
    this.deleteBatchDialog = true;
    this.batch = {...batch};
  }

  confirmDelete() {
    this.deleteBatchDialog = false;
    console.log(this.batch)
    const id: string = this.batch.funderStatementBatchId!
    this.listBatchFsService.deleteById(id)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Batch!',
            life: 3000
          });
          this.batchs = this.batchs.filter(val => val.funderStatementBatchId !== id);
          this.loadBatchs()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadBatchs()
        }
      });

    this.batch = {};
  }

  hideDialog() {
    this.batchDialog = false;
    this.submitted = false;
  }

  findIndexById(funderStatementBatchId: string): number {
    let index = -1;
    for (let i = 0; i < this.batchs.length; i++) {
      if (this.batchs[i].funderStatementBatchId === funderStatementBatchId) {
        index = i;
        break;
      }
    }

    return index;
  }

  onDetail(batchId: any) {
    // navigate to detail page /file-fs/:batchId
    this.router.navigate(['/main/file-fs', batchId]);
  }

  onGlobalFilter(table: Table, event: Event) {
    this.loading = true;
    let value = (event.target as HTMLInputElement).value;
    const filterBy: string = 'batchName';
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'asc';
    let sortBy: string = 'createdAt';

    this.listBatchFsService.getListBatchFs(page, sort, sortBy, size, filterBy, value)
      .subscribe({
        next: (response) => {
          this.batchs = response.data.content;
          this.totalBatchs = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.batchs = [];
          this.totalBatchs = 0;
          this.loading = false;
        }
      })


    console.log((event.target as HTMLInputElement).value)
  }

}
