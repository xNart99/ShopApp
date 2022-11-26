import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

const IMAGE_DIR = 'stored_images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  images: LocalFile[] = [];

  constructor() {
    this.loadSaved();
  }

  // Video tutorial: https://www.youtube.com/watch?v=fU8uM5oU1wY
  // docs https://ionicframework.com/docs/angular/your-first-app/saving-photos
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    console.log(image);

    if (image) {
      return image;
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });

    console.log('Saved file', savedFile);
    this.loadSaved();
    return fileName;
  }

  // load images from storage
  async loadSaved() {
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(res => {
      console.log(res);
      this.loadImage(res.files);
    }).catch(async err => {
      console.log(err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    });
  }

  // load image
  async loadImage(fileNames: string[]) {
    this.images = [];
    // check if file exists
    for (const f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      // add image to array
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
    }
  }

  // get image
  getImage(fileName: string) {
    return this.images.find(image => image.name === fileName);
  }

  private async readAsBase64(photo: Photo) {
  // Fetch the photo, read as a blob, then convert to base64 format
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const response = await fetch(photo.webPath!);
  const blob = await response.blob();

  return await this.convertBlobToBase64(blob) as string;
}

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});
}
