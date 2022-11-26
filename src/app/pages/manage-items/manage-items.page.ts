import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IProductModel } from 'src/app/models/i-product-model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.page.html',
  styleUrls: ['./manage-items.page.scss'],
})
export class ManageItemsPage implements OnInit {
  products: IProductModel[] = [];
  usersProducts: IProductModel[] = [];

  //  manage product subscriptions
  subscription: Subscription = new Subscription();

  constructor(
    private modalController: ModalController,
    private productService: ProductService,
    public imageService: ImageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // subscribe to products
    const sb = this.productService.product$.subscribe(
      products => {
        this.products = products;
        this.getUsersProducts();
      },
      err => {
        console.log(err);
      }
    );

    // add product subscription to subscription
    this.subscription.add(sb);
  }

  // show add product modal
  async openAddItemModal() {
    const modal = await this.modalController.create({
      component: EditProductComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data) {
      this.productService.addProduct(data.product);
    }
  }

  // show edit product modal
  async openEditItemModal(product: IProductModel) {
    console.log(product);
    const modal = await this.modalController.create({
      component: EditProductComponent,
      componentProps: {
        product
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data) {
      this.productService.editProduct(data.product);
    }
  }

  // delete product
  async deleteProduct(product: IProductModel) {
    this.productService.removeProduct(product);
  }

  // get current user's products
  getUsersProducts() {
    this.usersProducts = this.products.filter(product => product.userEmail === this.authService.getUser().email);
  }
}
