import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';
import {IUser} from "../../../interfaces/i-user";
import {UserService} from "../../../services/user.service";
import {RoleService} from "../../../services/role.service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management-fs.component.scss',
  providers: [MessageService]
})
export class UserManagementFsComponent {

  editUserDialog: boolean = false;

  deleteUsersDialog: boolean = false;

  deleteUserDialog: boolean = false;

  registerUserDialog: boolean = false;

  users: IUser[] = [];

  user: IUser = {};

  selectedUsers: IUser[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  roles: any[] = [];

  rowPerPageOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

  multipleDeleteIds: number[] = [];

  loading: boolean = false;

  selectAll: boolean = false;

  totalUsers: number = 0;

  sortField: string = 'createdAt';

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
    this.loading = true;

    this.cols = [
      {field: 'filename', header: 'Nama File'},
      {field: 'status', header: 'Status'},
      {field: 'readTimestamp', header: 'Dibaca Pada'},
      {field: 'createdBy', header: 'Dibuat Oleh'},
      {field: 'createdAt', header: 'Dibuat Pada'}
    ];

    this.roleService.getListRole(0, 'asc', 'roleId', 100)
      .subscribe(
        (response) => {
          this.roles = [
            ...response.data.content.map((role: any) => {
              return {label: role.roleName, value: role.roleId}
            })
          ]
          console.log('heheh')
        }
      );
  }

  loadFiles(event?: any) {
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'asc';
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

    this.userService.getListUser(page, sort, sortBy, size)
      .subscribe(
        (response) => {
          this.users = response.data.content;
          this.totalUsers = response.data.totalItems;
          this.loading = false;
        }
      )
  }

  onSelectionChange(event: any) {
    this.multipleDeleteIds = [];
    for (let i = 0; i < event.length; i++) {
      this.multipleDeleteIds.push(event[i].funderFileId!)
      console.log(event[i].funderFileId!)
    }
    console.log(this.multipleDeleteIds)
  }

  onBackButton() {
    window.history.back();
  }

  deleteSelectedFiles() {
    for (let i = 0; i < this.selectedUsers.length; i++) {
      this.multipleDeleteIds.push(this.selectedUsers[i].userId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.userService.multipleDelete(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Batch!',
            life: 3000
          });
          this.users = this.users.filter(val => !this.selectedUsers.includes(val));
          this.selectedUsers = [];
          this.loadFiles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadFiles()
        }
      });

    this.deleteUsersDialog = false;
  }

  onRowSelected(event: any) {
    console.log(event)
  }

  deleteConfirmDialog() {
    this.deleteUsersDialog = true
  }

  registerUser(user: IUser) {
    this.user = {...user};
    this.registerUserDialog = true;
  }

  deleteFile(user: IUser) {
    this.deleteUserDialog = true;
    this.user = {...user};
  }

  editUser(user: IUser) {
    this.editUserDialog = true;
    const userData = {
      ...user,
      roleModel: this.roles.find(role => role.value === user.roleModel)?.label
    }
    this.user = {...user};
    console.log(this.user)
  }

  saveEdit() {
    this.submitted = true;
    const roleId = this.roles.find(role => role.label === this.user.roleModel)?.value;
    const userId = this.user.userId!;

    const userData: any = {
      email: this.user.email?.replace(/ /g, '').toLowerCase(),
      roleId: roleId
    }

    this.userService.updateUser(userId, userData)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses memperbarui User!',
            life: 3000
          });
          this.loadFiles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadFiles()
        }
      });

    this.submitted = false;
    this.user = {};
    this.editUserDialog = false;
  }


  saveRegister() {
    this.submitted = true;
    const roleId = this.roles.find(role => role.label === this.user.roleModel)?.value;

    const user: any = {
      username: this.user.username?.replace(/ /g, '').toLowerCase(),
      email: this.user.email?.replace(/ /g, '').toLowerCase(),
      roleId: roleId
    }
    this.userService.registerUser(user)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menambahkan User!',
            life: 3000
          });
          this.loadFiles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadFiles()
        }
      });

    this.submitted = false;
    this.user = {};
    this.registerUserDialog = false;
  }

  confirmDelete() {
    this.deleteUserDialog = false;
    const id: number = this.user.userId!
    this.userService.deleteById(id)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus File!',
            life: 3000
          });
          this.users = this.users.filter(val => val.userId !== id);
          this.loadFiles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadFiles()
        }
      });

    this.user = {};
  }

  hideRegisterDialog() {
    this.registerUserDialog = false;
    this.submitted = false;
    this.user = {};
  }

  hideEditDialog() {
    this.editUserDialog = false;
    this.submitted = false;
    this.user = {};
  }

  findIndexById(userId: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId === userId) {
        index = i;
        break;
      }
    }

    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    this.loading = true;
    let value = (event.target as HTMLInputElement).value;
    const filterBy: string = 'username';
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'asc';
    let sortBy: string = 'createdAt';

    this.userService.getListUser(page, sort, sortBy, size, filterBy, value)
      .subscribe({
        next: (response) => {
          this.users = response.data.content;
          this.totalUsers = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.users = [];
          this.totalUsers = 0;
          this.loading = false;
        }
      })
  }

}
