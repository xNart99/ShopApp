import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { IProductModel } from 'src/app/models/i-product-model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input() product: IProductModel;
  previewImg: HTMLElement;

  photo: any;
  productForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private imageService: ImageService,
    private toastController: ToastController,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.previewImg = document.getElementById('preview-img');
    // update form when update product
    this.productForm = this.initForm();
    if (this.product?.urlImage) {
      // set background image for div if product has image
      this.previewImg.style.backgroundImage = `url(${this.imageService.getImage(this.product.urlImage)?.data})`;
    }
  }

  // init form
  initForm(): FormGroup {
    return new FormGroup({
      title: new FormControl(this.product?.title ? this.product.title : '', Validators.required),
      description: new FormControl(this.product?.description ? this.product.description : '', Validators.required),
      price: new FormControl(this.product?.price ? this.product.price : '', Validators.required),
      category: new FormControl(this.product?.category ? this.product.category : '', Validators.required),
      urlImage: new FormControl(this.product?.urlImage ? this.product.urlImage : '', Validators.required),
      userEmail: new FormControl(this.authService.getUser().email, Validators.required)
    });
  }


  // dismiss modal
  async dismissModal() {
    return await this.modalController.dismiss();
  }

  // save product
  async saveProduct() {
    // get product data from form
    const id = this.product?.id;
    this.product = this.productForm.getRawValue();
    if (id) {
      this.product.id = id;
    }
    // check form validity
    if (!this.productForm.valid) {
      this.showToast('Please fill all fields');
      return;
    }

    // check if image is selected
    if (this.photo?.webPath) {
      // save image
      const fileName = await this.imageService.saveImage(this.photo);
      // set path to product
      this.product.urlImage = fileName;
    } else if (!this.product.urlImage) {
      // show toast if no image selected
      this.showToast('Please select image');
      return;
    }
    // dismiss modal
    await this.modalController.dismiss({
      // return data to parent component
      product: this.product
    });
  }

  // select image
  async selectImage() {
    this.photo = await this.imageService.selectImage();
    this.setImage(this.photo.webPath);
  }

  // set image to form
  setImage(image: string) {
    console.log(image);
    this.productForm.patchValue({
      urlImage: image
    });
    // update preview image
    this.setPreviewImage(image);
  }

  // set preview image
  setPreviewImage(image: string) {
    this.previewImg.style.backgroundImage = `url(${image})`;
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
