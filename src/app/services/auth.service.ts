import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IUserModel } from '../models/i-user-model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  usersKey = 'users';
  // subscription to detect user change
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userList: IUserModel[] = [];
  private user: IUserModel;

  // manage subscriptions
  // eslint-disable-next-line @typescript-eslint/member-ordering
  subscription: Subscription = new Subscription();

  constructor(
    private storageService: StorageService
  ) {
    // check db ready
    const sb = this.storageService.isReady$.subscribe((ready: boolean) => {
      if (ready) {
        // get users
        this.getUsers();
      }
    });
    // add subscription to unsubscribe
    this.subscription.add(sb);
  }

  ngOnDestroy(): void {
    // unsubscribe all subscriptions
    this.subscription.unsubscribe();
  }

  // get users
  async getUsers(): Promise<void> {
    this.userList = await this.storageService.get(this.usersKey);
    if (!this.userList || this.userList.length === 0) {
      // add default shop user
      this.userList = [
        {
          email: 'seller@gmail.com',
          password: '123',
          role: 'seller'
        }
      ];
      this.storageService.set(this.usersKey, this.userList);
    }
    console.log(this.userList);
  }

  // login
  login(email: string, password: string): boolean {
    // check if user exists
    const user = this.userList.find((u: any) => u.email === email);
    if (user) {
      // check if passwords match
      if (user.password === password) {
        // set user
        this.user = user;
        // send logged in subscription
        this.isLoggedInSubject.next(true);
        console.log(user);
        return true;
      }
    }
    return false;
  }

  // logout
  logout(): void {
    this.user = null;
    // send logged out subscription
    this.isLoggedInSubject.next(false);
  }

  // is logged in
  isLoggedIn(): boolean {
    return this.user !== null;
  }

  // get user
  getUser(): IUserModel {
    return this.user;
  }

  // register
  register(user: IUserModel): Promise<any> {
    this.userList.push(user);
    return this.storageService.set(this.usersKey, this.userList);
  }

  // check if user exists
  userExists(email: string): boolean {
    return this.userList.find((u: any) => u.email === email) !== undefined;
  }

  // get user role
  getUserRole(): string {
    return this.user.role;
  }
}
