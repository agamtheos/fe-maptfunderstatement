import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListBatchFsService {

  constructor(private http: HttpClient, private router: Router) { }

  getListBatchFs(
    page: number, 
    sort: string, 
    sortBy: string,
    size: number,
    filterBy: string,
    value: string
    ): Observable<any> {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    };

    let url = `${environment.apiBaseUrl}/api/v1/batch-fs/${page}/${sort}/${sortBy}`;
    
    if (size) {
      url += `?size=${size}`;
    }

    if (filterBy && value) {
      url += `&?filter-by=${filterBy}&value=${value}`;
    }

    return this.http.get(url, { headers });
  }
}