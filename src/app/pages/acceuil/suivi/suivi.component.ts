import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientService } from 'src/app/services/client.service'; 
import { LocalStorageService } from 'src/app/services/local-storage.service'; 
import { NgFor, NgStyle, NgIf, NgClass } from '@angular/common';
import { FormatDatePipe } from '../../../validator/FormatDatePipe';

import {
  ButtonDirective,
  ColComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
}
from '@coreui/angular';
import { Router } from '@angular/router';
import { FormatCurrencyPipe } from '../../../validator/FormatCurrencyPipe';

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [
    NgFor, NgStyle, NgIf, NgClass,
    FormatDatePipe,
    ButtonDirective,
    ColComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    FormatCurrencyPipe,
    CardComponent,
    CardBodyComponent
  ],
  providers: [ClientService, LocalStorageService],
  templateUrl: './suivi.component.html',
  styleUrl: './suivi.component.scss'
})
export class SuiviComponent implements OnInit {

  listSuivi: any = [];
  errorMessage: string = '';
  listDetail: any = [];
  errorMessageDetail: string = '';

  ngOnInit() {

    const userRole = this.localStorageService.getLoginInfo()?.role ?? '';

    if (userRole != '1') {
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas accès à cette page.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }

    const iduser = this.localStorageService.getLoginInfo()?.iduser ?? '';
    this.getListSuivi(iduser);
    
  }

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorageService : LocalStorageService)
  { }
  

  getBadgeClass(avancement: number): string {
    switch (avancement) {
      case 1:
        return 'bg-warning'; // En attente (yellow)
      case 2:
        return 'bg-primary'; // En cours (blue)
      case 3:
        return 'bg-success'; // Terminé (green)
      default:
        return 'bg-secondary'; // Unknown state (gray)
    }
  }

  getBadgeLabel(avancement: number): string {
    switch (avancement) {
      case 1:
        return 'En attente';
      case 2:
        return 'En cours';
      case 3:
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  }

  getListSuivi(idclient: string) {
    this.clientService.suiviPrestation(idclient).subscribe(
      (data: any) => {
        this.listSuivi = data;
      },
      (error) => {
        console.error('Error fetching list propose:', error);
        this.errorMessage = error.error.message;
      }
    )
  }

  getListDetail(idRdv: string) {
    this.clientService.devisValideIdRdv(idRdv).subscribe(
      (data: any) => {
        this.listDetail = data;
      },
      (error) => {
        console.error('Error fetching list detail:', error);
        this.errorMessageDetail = error.error.message;
      }
    )
  }

  reload() {
    const iduser = this.localStorageService.getLoginInfo()?.iduser ?? '';
    this.getListSuivi(iduser);
  }

  goDetail(idRdv: string)  {
    this.getListDetail(idRdv);
  }

}
