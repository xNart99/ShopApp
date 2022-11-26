import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IUserModel } from 'src/app/models/i-user-model';
import { AuthService } from 'src/app/services/auth.service';

export interface IRegister {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {
    // init register form
    this.registerForm = this.initForm();
  }

  ngOnInit() {
  }

  // init new register form
  initForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      // role customer by default
      role: new FormControl('customer')
    });
  }

  // get form value
  getFormValue(): IRegister {
    return this.registerForm.getRawValue();
  }

  // check if passwords match
  passwordsMatch(): boolean {
    const formValue = this.getFormValue();
    return formValue.password === formValue.confirmPassword;
  }

  // on form submit
  onSubmit(): void {
    // if form is valid
    if (!this.registerForm.valid) {
      // show notification
      this.showToast('Please fill in all fields');
      return;
    }
    // check if passwords match
    if (!this.passwordsMatch()) {
      // show notification
      this.showToast('Passwords do not match');
      return;
    }

    // get form value
    const formValue = this.getFormValue();
    // create new user
    const user: IUserModel = {
      email: formValue.email,
      password: formValue.password,
      role: formValue.role
    };
    // check if user exists
    if (this.authService.userExists(user.email)) {
      this.showToast('User already exists');
      return;
    }
    // register user
    this.authService.register(user).then(() => {
      // show success toast
      this.showToast('User created!');
      this.router.navigate(['/login']);
    }).catch(err => {
      // show error toast
      this.showToast(err.message);
    });
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
