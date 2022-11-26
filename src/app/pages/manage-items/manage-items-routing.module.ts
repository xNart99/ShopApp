import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageItemsPage } from './manage-items.page';

const routes: Routes = [
  {
    path: '',
    component: ManageItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageItemsPageRoutingModule {}
