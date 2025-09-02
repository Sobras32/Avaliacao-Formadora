import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { SobrePage } from './sobre/sobre.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'sobre',
    component: SobrePage
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
