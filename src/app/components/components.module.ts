import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FloatMenuButtonComponent } from './float-menu-button/float-menu-button.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FloatMenuButtonComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    FloatMenuButtonComponent
  ]
})
export class ComponentsModule { }
