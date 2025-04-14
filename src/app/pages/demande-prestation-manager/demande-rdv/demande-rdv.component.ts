import { Component, OnInit } from '@angular/core';

import { NgFor, NgStyle, NgIf, DatePipe, CommonModule } from '@angular/common';

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
  FormCheckComponent
} from '@coreui/angular';
import { ManagerService } from '../../../services/manager.service';
import { Client } from '../../../modele/Client';
import { Mecanicien } from '../../../modele/Mecanicien';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder  } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormatDatePipe } from '../../../validator/FormatDatePipe';

@Component({
  selector: 'app-demande-rdv',
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
    TextColorDirective, NgFor, NgStyle, NgIf, ModalModule, FormCheckComponent,
    ReactiveFormsModule, FormatDatePipe, CommonModule
  ],
  templateUrl: './demande-rdv.component.html',
  styleUrl: './demande-rdv.component.scss'
})
export class DemandeRdvComponent implements OnInit {

  clients: Client[] = [ ];
  showSaisie: boolean = false;
  mecaniciensDisponibles: Mecanicien[] = [];
  dateSelected: string = '';
  dateSelectedFormated: Date | null = null;
  idRendezVousSelected: string = '';
  idClientSelected: string = '';
  selectedDateMap: { [key: string]: string } = {};
  idMecanicienSelected: string = '';
  proposeModal: boolean = false;
  proposeDateSelected: string = '';
  proposeForm!: FormGroup;
  mecanicienForm!: FormGroup;
  messageError: string = '';

  partProposeDate: boolean = false;

  constructor(
    private managerService: ManagerService,
    private formBuilder: FormBuilder,
  ) {
    this.proposeForm = this.formBuilder.group({
      selectedDatePropose: ['', [Validators.required]]
    });
    this.mecanicienForm = this.formBuilder.group({
      selectedMecanicien: [null, Validators.required] // Add validation
    });
  }

  formatDate(dateString: string, format: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, format) || '';
  }

  ngOnInit() {
    this.getRendezVousEnAttente();
  }

  // Handle the date selection
  selectDate(dateSelected: string, clientId: string): void {
    console.log('Date voafidy... ', dateSelected);

    this.selectedDateMap[clientId] = dateSelected;

    // Convert the string to a Date object
    const dateObject = new Date(dateSelected);

    // Verify the date is valid
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid date string:', dateSelected);
      return;
    }

    this.dateSelectedFormated = dateObject;
    this.getMecanicienDispo(this.dateSelectedFormated);
    console.log(this.mecaniciensDisponibles.map(m => m.id));

  }

  acceptDate(client: Client) {
    this.showSaisie = true;
    this.idRendezVousSelected = client.idrendezvous;
    this.idClientSelected = client.idclient;
    this.mecanicienForm.reset();
  }

  proposeDate(client: Client): void {
    this.proposeModal = true;
    this.idRendezVousSelected = client.idrendezvous;
    this.idClientSelected = client.idclient;
  }

  getRendezVousEnAttente(): void {
    this.managerService.rendezVousEnAttente().subscribe(
      (clients: Client[]) => {
        this.clients = clients; // Assign the actual array
      },
      (error) => {
        console.error('Error fetching clients:', error);
        this.messageError = error.error.message;
      }
    );
  }

  toggleLiveDemo() {
    this.showSaisie = !this.showSaisie;
    this.partProposeDate = false;
  }

  toggleLiveDemoPropose() {
    this.proposeModal = !this.proposeModal;
  }

  getMecanicienDispo(date: Date) {
    console.log("getmecanicien date "+date);

    this.managerService.mecaniciensDispo(date).subscribe({
      next: (mecaniciens: Mecanicien[]) => {
        this.mecaniciensDisponibles = mecaniciens;
        this.mecanicienForm.patchValue({ selectedMecanicien: null });
      },
      error: (err) => {
        console.error('Error fetching available mecanicien:', err);
        this.mecaniciensDisponibles = [];
      }
    });
    console.log(this.mecaniciensDisponibles);

  }

  selectMecanicien(mecanicien: any) {

    this.idMecanicienSelected = mecanicien._id;
    console.log(this.idMecanicienSelected);

  }

  save() {
    if (this.idMecanicienSelected === '') {
      Swal.fire('Error', 'Choisissez un mécanicien', 'error');
      return;
    }

    if(this.partProposeDate) {
      this.managerService.proposeDate(
        this.idRendezVousSelected,
        this.dateSelectedFormated,
        this.idMecanicienSelected,
        this.idClientSelected
      ).subscribe({
        next: (response: any) => {
          Swal.fire('Success', 'Proposition envoyé!', 'success');
          this.toggleLiveDemo();
          this.getRendezVousEnAttente();
        },
        error: (error: any) => {
          const message = error?.error?.error || 'Erreur';
          Swal.fire('Erreur', message, 'error');
          this.showSaisie = false;
        }
      });

    } else {
      this.managerService.rendezVousValider(
        this.idRendezVousSelected,
        this.dateSelectedFormated,
        this.idMecanicienSelected,
        this.idClientSelected
      ).subscribe({
        next: (response: any) => {
          Swal.fire('Success', 'Rendez-vous confirmé!', 'success');
          this.toggleLiveDemo();
          this.getRendezVousEnAttente();
        },
        error: (error: any) => {
          const message = error?.error?.error || 'Erreur';
          Swal.fire('Erreur', message, 'error');
          this.proposeModal = true;
          this.showSaisie = false;
        }
      });
    }

  }

  submitProposeDate() {
    if (this.proposeForm.invalid) {
      this.proposeForm.markAllAsTouched();
      return;
    }

    const date = this.proposeForm.get('selectedDatePropose')?.value;

    if (date) {

      this.dateSelected = date; // store raw string
      this.dateSelectedFormated = new Date(date);

      console.log("baoniufapo mafia game "+this.dateSelectedFormated)

      this.partProposeDate = true;
      this.getMecanicienDispo(date);
      this.proposeDateSelected = date;
      this.toggleLiveDemoPropose(); // Close current modal
      this.showSaisie = true;   // Open mechanic selection modal
    }
  }

}
