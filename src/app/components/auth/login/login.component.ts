import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layouts/service/app.layout.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISignin } from 'src/app/interfaces/i-signin';
import { IError } from 'src/app/interfaces/i-error';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { IResponse } from 'src/app/interfaces/i-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  valCheck: string[] = ['remember'];

  user: ISignin | undefined;
  error: IError;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private layoutService: LayoutService,
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) {
      this.error = {
        status: false,
        message: '',
        timestamp: 0
      }
    }

  onSubmit() {
    console.log('here')
    if (this.loginForm.valid) {
      this.user = {
        username: this.loginForm.get('username')?.value as string,
        password: this.loginForm.get('password')?.value as string
      }
      this.authService.signIn(this.user)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.error = {
          status: true,
          message: error.error.message,
          timestamp: error.error.timestamp
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.error.message
        })
        return throwError(() => new Error('Error login'))
      }))
      .subscribe((response: IResponse) => {
        this.authService.setAuth(response.data.token);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login success!'
        })
      })
    }
  }
}
