import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {
    // init login form
    this.loginForm = this.initForm();
  }

  ngOnInit() {
  }

  // init new login form
  initForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  // on form submit
  onSubmit(): void {
    // check if form is valid
    if (!this.loginForm.valid) {
      // show notification
      this.showToast('Please fill in all fields');
      return;
    }

    // get form value
    const formValue = this.getFormValue();
    if (this.authService.login(formValue.email, formValue.password)) {
      // show toast
      this.showToast('Login successful');
      // check user role
      if (this.authService.isLoggedIn && this.authService.getUserRole() === 'seller') {
        // redirect to select role page
        this.router.navigate(['/role-selector']);
      } else if (this.authService.isLoggedIn) {
        // redirect to home page
        this.router.navigate(['/home']);
      }
    } else {
      // show toast
      this.showToast('Login failed, Wrong email or password');
    }
  }

  // get form value
  getFormValue() {
    return this.loginForm.getRawValue();
  }

  // show toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
