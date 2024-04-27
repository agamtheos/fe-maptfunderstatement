import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';
import {IMenu} from "../../../interfaces/i-menu";
import {MenuService} from "../../../services/menu.service";

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management-fs.component.scss',
  providers: [MessageService]
})
export class MenuManagementFsComponent {

  editMenuDialog: boolean = false;

  deleteMenusDialog: boolean = false;

  deleteMenuDialog: boolean = false;

  registerMenuDialog: boolean = false;

  menus: IMenu[] = [];

  menu: IMenu = {};

  selectedMenus: IMenu[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowPerPageOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

  multipleDeleteIds: number[] = [];

  loading: boolean = false;

  selectAll: boolean = false;

  totalMenus: number = 0;

  sortField: string = 'createdAt';

  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
  }

  ngOnInit() {
    this.loading = true;
  }

  loadMenus(event?: any) {
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

    this.menuService.getListMenu(page, sort, sortBy, size)
      .subscribe({
        next: (response) => {
          this.menus = response.data.content;
          this.totalMenus = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.menus = [];
          this.totalMenus = 0;
          this.loading = false;
        }
      })
  }

  onSelectionChange(event: any) {
    this.multipleDeleteIds = [];
    for (let i = 0; i < event.length; i++) {
      this.multipleDeleteIds.push(event[i].menuId!)
    }
    console.log('sds')
    console.log(this.multipleDeleteIds)
  }

  onBackButton() {
    window.history.back();
  }

  deleteSelectedFiles() {
    for (let i = 0; i < this.selectedMenus.length; i++) {
      this.multipleDeleteIds.push(this.selectedMenus[i].menuId!);
    }

    let multipleDeleteIdsString = this.multipleDeleteIds.join(',');
    this.menuService.multipleDelete(multipleDeleteIdsString)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Menu!',
            life: 3000
          });
          this.menus = this.menus.filter(val => !this.selectedMenus.includes(val));
          this.selectedMenus = [];
          this.loadMenus()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadMenus()
        }
      });

    this.deleteMenusDialog = false;
  }

  onRowSelected(event: any) {
    console.log(event)
  }

  deleteConfirmDialog() {
    this.deleteMenusDialog = true
  }

  registerMenu(menu: IMenu) {
    this.menu = {...menu};
    this.registerMenuDialog = true;
  }

  deleteMenu(menu: IMenu) {
    this.deleteMenuDialog = true;
    this.menu = {...menu};
  }

  editMenu(menu: IMenu) {
    this.editMenuDialog = true;

    this.menu = {...menu};
  }

  saveEdit() {
    this.submitted = true;
    const menuId = this.menu.menuId!;

    const menuData: IMenu = {
      menuName: this.menu.menuName
    }

    this.menuService.updateMenu(menuId, menuData)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses memperbarui Menu!',
            life: 3000
          });
          this.loadMenus()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadMenus()
        }
      });

    this.submitted = false;
    this.menu = {};
    this.editMenuDialog = false;
  }


  saveRegister() {
    this.submitted = true;

    const menu: IMenu = {
      menuName: this.menu.menuName
    }
    this.menuService.registerMenu(menu)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menambahkan Menu!',
            life: 3000
          });
          this.loadMenus()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadMenus()
        }
      });

    this.submitted = false;
    this.menu = {};
    this.registerMenuDialog = false;
  }

  confirmDelete() {
    this.deleteMenuDialog = false;
    const id: number = this.menu.menuId!
    this.menuService.deleteById(id)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Sukses menghapus Menu!',
            life: 3000
          });
          this.menus = this.menus.filter(val => val.menuId !== id);
          this.loadMenus()
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
          this.loadMenus()
        }
      });

    this.menu = {};
  }

  hideRegisterDialog() {
    this.registerMenuDialog = false;
    this.submitted = false;
    this.menu = {};
  }

  hideEditDialog() {
    this.editMenuDialog = false;
    this.submitted = false;
    this.menu = {};
  }

  findIndexById(menuId: number): number {
    let index = -1;
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].menuId === menuId) {
        index = i;
        break;
      }
    }

    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    this.loading = true;
    let value = (event.target as HTMLInputElement).value;
    const filterBy: string = 'menuName';
    this.loading = true;
    let page: number = 0;
    let size: number = 10;
    let sort: string = 'asc';
    let sortBy: string = 'createdAt';

    this.menuService.getListMenu(page, sort, sortBy, size, filterBy, value)
      .subscribe({
        next: (response) => {
          this.menus = response.data.content;
          this.totalMenus = response.data.totalItems;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.menus = [];
          this.totalMenus = 0;
          this.loading = false;
        }
      })
  }

}
