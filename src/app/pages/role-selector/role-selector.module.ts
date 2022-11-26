import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoleSelectorPageRoutingModule } from './role-selector-routing.module';

import { RoleSelectorPage } from './role-selector.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoleSelectorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RoleSelectorPage]
})
export class RoleSelectorPageModule {}
