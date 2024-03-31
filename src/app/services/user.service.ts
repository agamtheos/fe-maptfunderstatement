import { Injectable } from '@angular/core';
import { ISignin } from '../interfaces/i-signin';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  isLoggedIn: boolean = false;
  baseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) { }

  
}