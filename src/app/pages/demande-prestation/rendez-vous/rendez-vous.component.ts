import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { DemandePrestationService } from '../../../services/demande-prestation.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormatDatePipe } from '../../../validator/FormatDatePipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, ReactiveFormsModule, FormatDatePipe, CommonModule],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.scss'
})
export class RendezVousComponent implements OnChanges {

  form!: FormGroup;
  selectedDate: string = '';
  selectedDates: string[] = [];
  selectedDatesOK: string[] = [];
  @Input() idDevis!: string;
  @Output() messageEvent = new EventEmitter<number>();
  @Output() dataEvent = new EventEmitter<any>();
  check = false;
  showDateError = false;
  infoSup!: string;

  idDevisRendezVous = '';


  constructor(
    private formBuilder: FormBuilder,
    private demandePrestationService: DemandePrestationService,
    private router: Router, 
  )
  {
    this.form = this.formBuilder.group({
      selectedDate: ['', [Validators.required]],
      infoSupplementaire: ['']
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idDevis'] && changes['idDevis'].currentValue) {
      console.log("Updated idDevis in rendezvous:", this.idDevis);
      this.idDevisRendezVous = this.idDevis;
    }
  }

  addDate() {
    const date = this.form.get('selectedDate')?.value;
    this.form.get('selectedDate')?.markAsTouched(); // Mark as touched to trigger validation
    if (date && !this.selectedDates.includes(date)) {
      this.selectedDates.push(date);
      this.form.get('selectedDate')?.setValue(''); // Reset the input
    }
  }
  
  removeDate(date: string) {
    this.selectedDates = this.selectedDates.filter(d => d !== date);
  }



  public getFormSelectClass(name: string) {
    return 'form-select ' + (this.isValide('nom') ? 'is-invalid' : '');
  }

  public getFormClass(name: string) {
    return 'form-control ' + (this.isValide('nom') ? 'is-invalid' : '');
  }

  public isValide(name: string): boolean {
    const control = this.form.get(name);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public isRequired(name: string): boolean {
    const control = this.form.get(name);
    return !!(control && control?.errors?.["required"] && (control.dirty || control.touched));
  }


  demandeRendezVous() {
    this.infoSup = this.form.value.infoSupplementaire;
    console.log("info supp "+this.infoSup);

    this.selectedDatesOK = this.selectedDates.map((date) => new Date(date).toISOString());

    console.log(this.selectedDatesOK);

    console.log(this.selectedDates);
    
    
    this.demandePrestationService.demandeRendezVous(this.idDevisRendezVous, this.selectedDates, this.infoSup)
      .subscribe(
        (response) => {
          console.log(response);
          
          if (response.status === 201) {
            Swal.fire({
              title: 'Votre demande a été envoyée!',  
              text: `Dates demandées: ${this.selectedDatesOK.join(', ')}`,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                  this.router.navigate(['/acceuil']);
              }
          });
          } else {
            Swal.fire({
              title: 'Une erreur s’est produite',
              text: response.message || 'Veuillez essayer plus tard.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            // this.messageEvent.emit(2);
          }
        },
        (error) => {
          console.error('Error during request:', error);
          Swal.fire({
            title: 'Une erreur s’est produite',
            text: error.error.error || 'Impossible de traiter la demande. Veuillez essayer plus tard.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          // this.messageEvent.emit(2);

        }
      );
  }
  


  valider(): void {

    if (this.selectedDates.length === 0) {
      this.showDateError = true;
      return;
    }
    this.showDateError = false;

    this.demandeRendezVous();

    this.check = true;
    // this.messageEvent.emit(3);
    this.dataEvent.emit(this.form.valid);
  }

}
