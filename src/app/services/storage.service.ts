import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: Storage | null = null;
  // db ready subscription
  private isReadySubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  isReady$ = this.isReadySubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  // init storage
  async init() {
    const storage = await this.storage.create();
    this.db = storage;
    console.log('DB ready');
    this.isReadySubject.next(true);
  }

  // set value
  public set(key: string, value: any) {
    return this.db?.set(key, value);
  }

  // get value
  public async  get(key: string) {
    return await this.db?.get(key);
  }

  // remove value
  public remove(key: string) {
    return this.db?.remove(key);
  }

  // clear storage
  public clear() {
    return this.db?.clear();
  }

  //  get all keys
  public keys() {
    return this.db?.keys();
  }

  // get storage length
  public length() {
    return this.db?.length();
  }

}
