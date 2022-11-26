import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserGuard } from './services/user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    // accept only logged in users
    canActivate: [UserGuard]
  },
  {
    path: 'manage-items',
    loadChildren: () => import('./pages/manage-items/manage-items.module').then( m => m.ManageItemsPageModule),
    // accept only logged in users and only seller
    canActivate: [UserGuard],
    data: { role: 'seller' }
  },
  {
    path: 'role-selector',
    loadChildren: () => import('./pages/role-selector/role-selector.module').then( m => m.RoleSelectorPageModule),
    // accept only logged in users and only seller
    canActivate: [UserGuard],
    data: {
      role: 'seller'
    }
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule),
    canActivate: [UserGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
