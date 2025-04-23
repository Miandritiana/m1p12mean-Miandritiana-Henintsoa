import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'acceuil',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Accueil'
    },
    children: [
      {
        path: 'acceuil',
        loadChildren: () => import('./pages/acceuil/routes').then((m) => m.routes) 
      },
      {
        path: 'suivi',
        loadComponent: () => import('./pages/acceuil/suivi/suivi.component').then(m => m.SuiviComponent)
      },
      {
        path: 'demande-prestation',
        loadChildren: () => import('./pages/demande-prestation/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Manager',
    },
    children: [
      {
        path: 'demande-prestation-manager',
        loadChildren: () => import('./pages/demande-prestation-manager/routes').then((m) => m.routes)
      },
      {
        path: 'parametre-mecanicien',
        loadChildren: () => import('./pages/gestion-mecanicien/routes').then((m) => m.routes)
      },
      {
        path: 'parametre-prestation',
        loadChildren: () => import('./pages/gestion-prestation/routes').then((m) => m.routes)
      },
      {
        path: 'histo-prestation',
        loadChildren: () => import('./pages/histo-prestation/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Mécanicien',
    },
    children: [
      {
        path: 'tache',
        loadChildren: () => import('./pages/mecanicien/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'change-mdp',
        loadComponent: () => import('./pages/mecanicien/change-mdp/change-mdp.component').then(m => m.ChangeMdpComponent),
        data: { title: 'Changer le mot de passe' }
      }
    ]
  },  
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/login/inscription/inscription.component').then(m => m.InscriptionComponent),
    data: {
      title: 'Inscription Page'
    }
  },
  { path: '**', redirectTo: 'etudiant' }
];
