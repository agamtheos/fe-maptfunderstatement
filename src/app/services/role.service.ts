import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {UtilService} from "./util.service";
import {IResponse} from "../interfaces/i-response";
import {IRole} from "../interfaces/i-role";
import {IMenu} from "../interfaces/i-menu";

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  baseUrl = environment.apiBaseUrl + '/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService
  ) {
  }

  getListRole(
    page: number,
    sort: string,
    sortBy: string,
    size: number,
    filterBy?: string,
    value?: string
  ): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/role/${page}/${sort}/${sortBy}`;

    if (size) {
      url += `?size=${size}`;
    }

    if (filterBy && value) {
      url += `&filter-by=${filterBy}&value=${value}`;
    }

    return this.http.get<IResponse>(url, {headers});
  }

  deleteById(id: number): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.delete<IResponse>(`${this.baseUrl}/v1/role/${id}`, {headers});
  }

  multipleDelete(ids: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.get<IResponse>(`${this.baseUrl}/v1/role/multiple-delete/${ids}`, {headers});
  }

  updateRole(roleId: number, role: IRole, menus: IMenu[]): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    const data = {
      roleName: role.roleName,
      menuModel: menus
    }

    let url = `${this.baseUrl}/v1/role/${roleId}`;

    return this.http.put<IResponse>(url, data, {headers});
  }

  registerRole(role: IRole, menu: IMenu[]): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    const data = {
      roleName: role.roleName,
      menuModel: menu
    }

    return this.http.post<IResponse>(`${this.baseUrl}/v1/role`, data, {headers});
  }
}
