import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router";

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth()) {
    return true;
  }

  router.navigate(['']);
  return false;
}

export const PreventGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth()) {
    router.navigate(['/cekduludiguard']);
    return false;
  }

  return true;
}
