import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { ListNewProposeDateComponent } from './list-new-propose-date/list-new-propose-date.component';
import { SuiviComponent } from './suivi/suivi.component';
import { RouterModule, Routes } from '@angular/router';
import { DemandePrestationComponent } from '../demande-prestation/demande-prestation/demande-prestation.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent }
];

@NgModule({
  declarations: [AcceuilComponent, ListNewProposeDateComponent, SuiviComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DemandePrestationComponent
  ],
  exports: [RouterModule]
})
export class AcceuilModule { 

}
