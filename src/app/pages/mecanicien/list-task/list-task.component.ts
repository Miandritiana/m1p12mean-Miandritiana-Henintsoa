import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TextColorDirective,
  ModalModule,
  FormCheckComponent,
  DropdownModule
}
from '@coreui/angular';
import { FormsModule } from '@angular/forms';

import { NgFor, NgStyle, NgIf, NgClass, CommonModule } from '@angular/common';
import { MecanicienService } from '../../../services/mecanicien.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TextColorDirective,
    ModalModule,
    FormCheckComponent,
    NgFor, NgStyle, NgIf, NgClass, CommonModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent implements OnInit{

  listTache: any[] = [];
  @Output() dataEvent = new EventEmitter<any>();
  isAppear: boolean = true;
  selectedDate: string = '';
  selectedAvancement: string = '';
  selectedAvancementNumber: number = 0;
  selectedDateFormated: Date | null = null;
  avancementList: any = [0, 1, 2, 3];

  constructor (
    private mecanicienService: MecanicienService,
    private localStorageService : LocalStorageService,
    private router: Router
  )
  {}

  ngOnInit() {
    var idMecanicien = this.localStorageService.getLoginInfo()?.iduser ?? '';
    this.getListTache(idMecanicien);
  }

  getListTache(idmecanicien: string) {
    this.mecanicienService.tacheWithSearch(undefined, undefined, idmecanicien).subscribe(
      data => {
        this.listTache = data;
      }
    )
  }

  getBadgeClass(avancement: number): string {
    switch (avancement) {
      case 0:
        return 'bg-info';
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
      case 0:
        return 'Tous';
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


  selectAvancement(item: any) {
    console.log(item);
    this.selectedAvancement = item;
    this.selectedAvancementNumber = Number(this.selectedAvancement);
  }

  goDetail(idrendezvous: string) {
    // this.isAppear = false;
    this.dataEvent.emit(idrendezvous);
  }


  reload() {
    this.getListTache(this.localStorageService.getLoginInfo()?.iduser ?? '');
  }


  appliquer() {
    var idmecanicien = this.localStorageService.getLoginInfo()?.iduser ?? '';
    const dateObject = new Date(this.selectedDate);
    this.selectedDateFormated = new Date(Date.UTC(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate(),
      dateObject.getHours(),
      dateObject.getMinutes()
    ));

    let avancementParam = this.selectedAvancementNumber === 0 ? undefined : this.selectedAvancementNumber;
    this.mecanicienService.tacheWithSearch(this.selectedDateFormated, avancementParam, idmecanicien).subscribe(
      data => {
        this.listTache = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des rendez-vous', error);
        const errorMessage = error?.error?.message || 'Une erreur est survenue';

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
        });
      }
    )
  }
}
