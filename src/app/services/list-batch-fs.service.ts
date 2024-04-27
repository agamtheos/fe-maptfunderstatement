import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { IResponse } from '../interfaces/i-response';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ListBatchFsService {

  baseUrl = environment.apiBaseUrl + '/api';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private utilService: UtilService
    ) { }

  getListBatchFs(
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

    let url = `${this.baseUrl}/v1/funder-statement-batch/${page}/${sort}/${sortBy}`;
    
    if (size) {
      url += `?size=${size}`;
    }

    if (filterBy && value) {
      url += `&filter-by=${filterBy}&value=${value}`;
    }

    return this.http.get<IResponse>(url, { headers });
  }

  getAllTemplateByName(name?: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/funder-statement-template`;

    if (name) {
      url += `?value=${name}`;
    }

    return this.http.get<IResponse>(url, { headers });
  }

  uploadBatch(
    formData: FormData,
    templateId: number,
    ): Observable<any> {
      const token = this.utilService.getLocalStorageItem('token');
      const headers = {
        'Authorization': 'Bearer ' + token
      }

      return this.http.post<any>(`${this.baseUrl}/v1/funder-statement-batch/upload?templateId=${templateId}`, formData, { headers });
  }

  deleteById(id: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    return this.http.delete<IResponse>(`${this.baseUrl}/v1/funder-statement-batch/${id}`, { headers });
  }

  multipleDelete(ids: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/funder-statement-batch/multiple-delete`;

    if (ids.length > 0) {
      url += `/${ids}`;
    }

    return this.http.get<IResponse>(url, { headers });
  }

  approveBatch(ids: string): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem('token')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/funder-statement-batch/approve`;

    if (ids.length > 0) {
      url += `/${ids}`;
    }

    return this.http.put<IResponse>(url, null, { headers });
  }

  rejectBatch(ids: string) {
    const token = this.utilService.getLocalStorageItem('token')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    let url = `${this.baseUrl}/v1/funder-statement-batch/reject`;

    if (ids.length > 0) {
      url += `/${ids}`;  
    }
    
    return this.http.put<IResponse>(url, null, { headers });
  }
}