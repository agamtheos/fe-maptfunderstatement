import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { ISignin } from '../interfaces/i-signin';
import { IResponse } from '../interfaces/i-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';

  constructor(private http: HttpClient, private router: Router) { }

  signIn(user: ISignin): Observable<IResponse> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(user);
    return this.http.post<IResponse>(`${this.baseUrl}/auth/v1/login`, body, { headers });
  }

  setAuth(token: string) {
    localStorage.setItem(this.keyToken, token);
    this.isLoggedIn = true;
  }

  isAuth(): boolean {
    if (localStorage.getItem(this.keyToken)) {
      this.isLoggedIn = true;
      return this.isLoggedIn;
    }
    return false;
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken) || '';
  }

  logout() {
    localStorage.removeItem(this.keyToken);
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}