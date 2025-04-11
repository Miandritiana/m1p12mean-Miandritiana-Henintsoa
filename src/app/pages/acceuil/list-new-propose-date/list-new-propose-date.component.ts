import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientService } from 'src/app/services/client.service'; 
import { LocalStorageService } from 'src/app/services/local-storage.service'; 
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { FormatDatePipe } from '../../../validator/FormatDatePipe';

import {
  ButtonDirective,
  ColComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
}
from '@coreui/angular';

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
    this.getList(iduser);
  }

  constructor(
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
    
  }
}
