import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';
import {IRole} from "../../../interfaces/i-role";
import {RoleService} from "../../../services/role.service";
import {IMenu} from "../../../interfaces/i-menu";
import {MenuService} from "../../../services/menu.service";

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management-fs.component.scss',
  providers: [MessageService]
})
export class RoleManagementFsComponent {

  editRoleDialog: boolean = false;

  deleteRolesDialog: boolean = false;

  deleteRoleDialog: boolean = false;

  registerRoleDialog: boolean = false;

  roles: IRole[] = [];

  role: IRole = {};

  menus: IMenu[] = [];

  selectedMenus: IMenu[] = [];

  selectedRoles: IRole[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowPerPageOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

  multipleDeleteIds: number[] = [];

  loading: boolean = false;

  selectAll: boolean = false;

  totalRoles: number = 0;

  sortField: string = 'createdAt';

  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private menuService: MenuService
  ) {
  }

  ngOnInit() {
    this.loading = true;
  }

  loadRoles(event?: any) {
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

    this.roleService.getListRole(page, sort, sortBy, size)
      .subscribe({
        next: (response) => {
          this.roles = response.data.content;
          this.totalRoles = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.roles = [];
          this.totalRoles = 0;
          this.loading = false;
        }
      })
  }

  onSelectionChange(event: any) {
    this.multipleDeleteIds = [];
    for (let i = 0; i < event.length; i++) {
      this.multipleDeleteIds.push(event[i].menuId!)
    }
  }

  onClickMultiSelect() {
    this.menuService.getListMenu(0, 'asc', 'createdAt', 1000)
      .subscribe({
        next: (response) => {
          this.menus = response.data.content;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.menus = [];
          this.loading = false;
        }
      });
    console.log('gege')
  }

  deleteSelectedRoles() {
    for (let i = 0; i < this.selectedRoles.length; i++) {
      this.multipleDeleteIds.push(this.selectedRoles[i].roleId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.roleService.multipleDelete(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Role!',
            life: 3000
          });
          this.roles = this.roles.filter(val => !this.selectedRoles.includes(val));
          this.selectedRoles = [];
          this.loadRoles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadRoles()
        }
      });

    this.deleteRolesDialog = false;
  }

  onRowSelected(event: any) {
    console.log(event)
  }

  deleteConfirmDialog() {
    this.deleteRolesDialog = true
  }

  registerRole(role: IRole) {
    this.role = {...role};
    this.registerRoleDialog = true;
  }

  deleteRole(role: IRole) {
    this.deleteRoleDialog = true;
    this.role = {...role};
  }

  editRole(role: IRole) {
    this.onClickMultiSelect();
    this.editRoleDialog = true;

    this.role = {...role};
    this.selectedMenus = role.menuModel!;

  }

  saveEdit() {
    this.submitted = true;
    const roleId = this.role.roleId!;

    const roleData: IRole = {
      roleName: this.role.roleName
    }

    const menus: IMenu[] = []
    this.selectedMenus.forEach((menu) => {
      const data = {
        menuId: menu.menuId
      }
      menus.push(data)
    })

    this.roleService.updateRole(roleId, roleData, menus)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses memperbarui Role!',
            life: 3000
          });
          this.loadRoles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadRoles()
        }
      });

    this.submitted = false;
    this.role = {};
    this.editRoleDialog = false;
  }


  saveRegister() {
    this.submitted = true;

    const role: IRole = {
      roleName: this.role.roleName?.toLowerCase()
    }

    const menus: IMenu[] = []
    this.selectedMenus.forEach((menu) => {
      const data = {
        menuId: menu.menuId
      }
      menus.push(data)
    })

    this.roleService.registerRole(role, menus)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menambahkan Role!',
            life: 3000
          });
          this.loadRoles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadRoles()
        }
      });

    this.submitted = false;
    this.role = {};
    this.registerRoleDialog = false;
    this.selectedMenus = [];
  }

  confirmDelete() {
    this.deleteRoleDialog = false;
    const id: number = this.role.roleId!
    this.roleService.deleteById(id)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Role!',
            life: 3000
          });
          this.roles = this.roles.filter(val => val.roleId !== id);
          this.loadRoles()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadRoles()
        }
      });

    this.role = {};
  }

  hideRegisterDialog() {
    this.registerRoleDialog = false;
    this.submitted = false;
    this.role = {};
  }

  hideEditDialog() {
    this.editRoleDialog = false;
    this.submitted = false;
    this.role = {};
    this.selectedMenus = [];
  }

  findIndexById(roleId: number): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].roleId === this.role) {
        index = i;
        break;
      }
    }

    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    this.loading = true;
    let value = (event.target as HTMLInputElement).value;
    const filterBy: string = 'roleName';
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'asc';
    let sortBy: string = 'createdAt';

    this.roleService.getListRole(page, sort, sortBy, size, filterBy, value)
      .subscribe({
        next: (response) => {
          this.roles = response.data.content;
          this.totalRoles = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.roles = [];
          this.totalRoles = 0;
          this.loading = false;
        }
      })
  }

}
