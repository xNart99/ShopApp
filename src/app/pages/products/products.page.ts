import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductModel } from 'src/app/models/i-product-model';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
  category: string;
  productList: IProductModel[] = [];

  // manage subscriptions
  subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public imageService: ImageService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // get category from url
    this.category = this.route.snapshot.paramMap.get('category');
    // get products
    const sb = this.productService.product$.subscribe(products => {
      if (this.category.toUpperCase() === ('All').toUpperCase()) {
        this.productList = products;
      } else {
        this.productList = products.filter(product => product.category.toUpperCase() === this.category.toUpperCase());
      }
    });
    this.subscription.add(sb);
  }

}
