import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const role = route.data.role;
      if (role) {
        if (this.authService.isLoggedIn && this.authService.getUser()?.role === role) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      } else {
        if (this.authService.getUser()) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }
  }
}
