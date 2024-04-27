import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {UtilService} from "./util.service";
import {IResponse} from "../interfaces/i-response";
import {IMenu} from "../interfaces/i-menu";

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  baseUrl = environment.apiBaseUrl + '/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService
  ) {
  }

  getListMenu(
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

    let url = `${this.baseUrl}/v1/menu/${page}/${sort}/${sortBy}`;

    if (size) {
      url += `?size=${size}`;
    }

    if (filterBy && value) {
      url += `&filter-by=${filterBy}&value=${value}`;
    }

    return this.http.get<IResponse>(url, {headers});
  }

  multipleDelete(ids: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.get<IResponse>(`${this.baseUrl}/v1/menu/multiple-delete/${ids}`, {headers});
  }

  registerMenu(menu: IMenu): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.post<IResponse>(`${this.baseUrl}/v1/menu`, menu, {headers});
  }

  deleteById(menuId: number): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.delete<IResponse>(`${this.baseUrl}/v1/menu/${menuId}`, {headers});
  }

  updateMenu(menuId: number, menu: IMenu): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/menu/${menuId}`;

    return this.http.put<IResponse>(url, menu, {headers});
  }
}
