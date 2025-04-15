import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@coreui/angular';

import { GestionPrestationRoutingModule } from './gestion-prestation-routing.module';
import { RouterModule } from '@angular/router';

import { StepsModule } from 'primeng/steps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    StepsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(GestionPrestationRoutingModule),
  ]
})
export class GestionPrestationModule { }
