import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IProductModel } from '../models/i-product-model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsKey = 'products';
  subscription: Subscription = new Subscription();

  productList: IProductModel[] = [];

  // create subscription to detect products change
  private productsSubject = new BehaviorSubject<IProductModel[]>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public product$ = this.productsSubject.asObservable();


  constructor(
    private storageService: StorageService,
    private toastController: ToastController
  ) {
    // check db ready
    const sb = this.storageService.isReady$.subscribe((ready: boolean) => {
      if (ready) {
        // get products
        this.getProducts();
      }
    });
    // add subscription to unsubscribe
    this.subscription.add(sb);
  }

  // get products
  async getProducts(): Promise<void> {
    this.productList = [];
    this.productList = await this.storageService.get(this.productsKey);
    if (this.productList) {
      this.productsSubject.next(this.productList);
    } else {
      this.productList = [];
    }
    console.log(this.productsSubject.value);
  }

  // add product
  async addProduct(product: IProductModel): Promise<void> {
    // set id for new product
    product.id = this.getLastProductId() + 1;
    // add product to list
    this.productList.push(product);
    // save to storage
    await this.storageService.set(this.productsKey, this.productList).then(() => {
      // update subject
      this.productsSubject.next(this.productList);
      this.showToast('Product added');
    }).catch(err => {
      console.log('addProduct error: ', err);
      // show toast message
      this.showToast('Error adding product');
    });
  }

  // get last product id
  getLastProductId(): number {
    // if no products return 0 as id, else return last product id
    return this.productList.length > 0 ? this.productList[this.productList.length - 1].id : 0;
  }

  // edit product
  async editProduct(product: IProductModel): Promise<void> {
    // get product index in list
    const index = this.productList.findIndex(p => p.id === product.id);
    // replace product in list
    this.productList[index] = product;
    // update storage
    await this.storageService.set(this.productsKey, this.productList).then(() => {
      // update subject
      this.productsSubject.next(this.productList);
      // show toast message
      this.showToast('Product updated');
    }).catch(err => {
      console.log('editProduct error: ', err);
      // show toast message
      this.showToast('Error updating product');
    });
  }

  // remove product
  async removeProduct(product: IProductModel): Promise<void> {
    // get product index in list
    const index = this.productList.findIndex(p => p.id === product.id);
    // remove product from list
    this.productList.splice(index, 1);
    // update storage
    await this.storageService.set(this.productsKey, this.productList).then(() => {
      // update subject
      this.productsSubject.next(this.productList);
      // show toast message
      this.showToast('Product removed');
    }).catch(err => {
      console.log('removeProduct error: ', err);
      // show toast message
      this.showToast('Error removing product');
    });
  }

  // show toast
  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
