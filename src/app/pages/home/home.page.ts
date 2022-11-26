import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductModel } from 'src/app/models/i-product-model';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  productList: IProductModel[] = [];
  categoryList = [];

  // manage product subscriptions
  subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    public imageService: ImageService,
    private router: Router
  ) { }

  ngOnInit() {
    // subscribe to products
    const sb = this.productService.product$.subscribe(
      (products) => {
        this.productList = products;
        // get categories
        this.categoryList = products.map(product => product.category.toUpperCase());
        // remove duplicates
        this.categoryList = this.categoryList.filter((value, index, self) => self.indexOf(value) === index);
      },
      err => {
        console.log(err);
      }
    );
    // add product subscription to subscription
    this.subscription.add(sb);
  }

  // show products by category
  showProductsByCategory(category: string) {
    // navigate to category page and pass category name
    this.router.navigate(['/products', category]);
  }

}
