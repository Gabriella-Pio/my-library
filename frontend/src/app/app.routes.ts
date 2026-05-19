import { Routes } from '@angular/router';

import { AppLayoutComponent } from './core/layout/app-layout/app-layout.component';
import { CategoriaListComponent } from './features/categorias/pages/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './features/categorias/pages/categoria-form/categoria-form.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'categorias',
        pathMatch: 'full',
      },

      {
        path: 'categorias',
        component: CategoriaListComponent,
      },

      {
        path: 'categorias/nova',
        component: CategoriaFormComponent,
      },

      {
        path: 'categorias/editar/:id',
        component: CategoriaFormComponent,
      },

      // adicionar aqui as demais rotas
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
