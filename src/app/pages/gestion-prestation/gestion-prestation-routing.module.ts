import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionPrestationComponent } from './gestion-prestation/gestion-prestation.component';


export const GestionPrestationRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: GestionPrestationComponent,
      },
    ],
  },
];  