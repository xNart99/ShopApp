import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageItemsPageRoutingModule } from './manage-items-routing.module';

import { ManageItemsPage } from './manage-items.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageItemsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ManageItemsPage]
})
export class ManageItemsPageModule {}
