import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserModel } from './models/i-user-model';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: IUserModel;

  public menu = [];
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // subscribe to user changes
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.user = this.authService.getUser();
        if (this.user.role === 'seller') {
          this.menu = [
            { title: 'Home', url: '/home' },
            { title: 'Manage Items', url: '/manage-items' },
            { title: 'Select role', url: '/role-selector' },
          ];
        } else {
          this.menu = [
            { title: 'Home', url: '/home' },
          ];
        }
      } else {
        this.user = null;
        this.menu = [
          { title: 'Login', url: '/login' },
          { title: 'Register', url: '/register' },
        ];
      }
    });
  }

  // logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
