import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { ISignin } from '../interfaces/i-signin';
import { IResponse } from '../interfaces/i-response';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  baseUrl = environment.apiBaseUrl + '/api';
  keyToken: string = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService
    ) { }

  signIn(user: ISignin): Observable<IResponse> {
    this.utilService.removeLocalStorageItem(this.keyToken);
    this.utilService.removeLocalStorageItem('menu');
    this.utilService.removeLocalStorageItem('role');
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(user);
    return this.http.post<IResponse>(`${this.baseUrl}/auth/v1/login`, body, { headers });
  }

  signOut(): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem(this.keyToken);
    this.utilService.removeLocalStorageItem(this.keyToken);
    this.utilService.removeLocalStorageItem('menu');
    this.utilService.removeLocalStorageItem('role');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };
    return this.http.post<IResponse>(`${this.baseUrl}/auth/v1/logout`, null, { headers });
  }

  setAuth(token: string) {
    this.utilService.setLocalStorageItem(this.keyToken, token)
    this.isLoggedIn = true;
  }

  setMenuLocal(menu: any) {
    this.utilService.setLocalStorageItem('menu', menu);
  }

  setRoleLocal(role: any) {
    this.utilService.setLocalStorageItem('role', role);
  
  }

  isAuth(): boolean {
    const token = this.utilService.getLocalStorageItem(this.keyToken);
    if (token) {
      this.getValidateToken().subscribe(
        res => {
          if (res.status === 401) {
            this.utilService.removeLocalStorageItem(this.keyToken);
            this.utilService.removeLocalStorageItem('menu');
            this.utilService.removeLocalStorageItem('role');
            this.router.navigate(['/auth/login']);
          }
        },
        err => {
          this.utilService.removeLocalStorageItem(this.keyToken);
          this.utilService.removeLocalStorageItem('menu');
          this.utilService.removeLocalStorageItem('role');
          this.router.navigate(['/auth/login']);
        }
      );

      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  getValidateToken(): Observable<IResponse> {
    const token = this.utilService.getLocalStorageItem(this.keyToken);
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };
    return this.http.get<IResponse>(`${this.baseUrl}/auth/v1/validate`, { headers });
  }
}