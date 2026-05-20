import { Routes } from '@angular/router';

import { AppLayoutComponent } from './core/layout/app-layout/app-layout.component';
import { CategoriaListComponent } from './features/categorias/pages/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './features/categorias/pages/categoria-form/categoria-form.component';
import { LivroListComponent } from './features/livros/pages/livro-list/livro-list.component';
import { LivroFormComponent } from './features/livros/pages/livro-form/livro-form.component';

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

      {
        path: 'livros',
        component: LivroListComponent,
      },

      {
        path: 'livros/novo',
        component: LivroFormComponent,
      },

      {
        path: 'livros/editar/:id',
        component: LivroFormComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
