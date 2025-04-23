import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientService } from 'src/app/services/client.service'; 
import { LocalStorageService } from 'src/app/services/local-storage.service'; 
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { FormatDatePipe } from '../../../validator/FormatDatePipe';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective,
  ColComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
}
from '@coreui/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-new-propose-date',
  standalone: true,
  imports: [
    NgFor, NgStyle, NgIf,
    FormatDatePipe,
    ButtonDirective,
    ColComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    CommonModule
  ],
  providers: [ClientService, LocalStorageService],
  templateUrl: './list-new-propose-date.component.html',
  styleUrl: './list-new-propose-date.component.scss'
})
export class ListNewProposeDateComponent implements OnInit {

  errorMessage: string = '';
  listNewPropose: any = [];

  ngOnInit() {
    const iduser = this.localStorageService.getLoginInfo()?.iduser ?? '';

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
    
    this.getList(iduser);
  }

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorageService : LocalStorageService)
  { }

  getList(idClient: string) {
    console.log("aosinurvcaosei");
    this.clientService.listNewProposeDate(idClient).subscribe(
      (response) => {
        this.listNewPropose = response;
        console.log(this.listNewPropose)
      },
      (error) => {
        console.error('Error fetching list propose:', error);
        this.errorMessage = error.error.message;
      }
    );
  }

  acceptDatePropose(idRdv: string) {
    const idclient = this.localStorageService.getLoginInfo()?.iduser;

    if (!idclient) {
      console.error('ID client non défini');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de récupérer l\'identifiant du client.',
      });
      return;
    }
  
    this.clientService.accepetDatePropose(idRdv, idclient).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Date acceptée',
          text: response.message || 'La date proposée a été acceptée avec succès.',
        });
        this.getList(idclient);
      },
      (error) => {
        console.error('Error fetching list propose:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error?.message || 'Une erreur est survenue lors de l\'acceptation.',
        });
      }
    );
  }
  
}
