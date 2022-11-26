import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleSelectorPage } from './role-selector.page';

const routes: Routes = [
  {
    path: '',
    component: RoleSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleSelectorPageRoutingModule {}
