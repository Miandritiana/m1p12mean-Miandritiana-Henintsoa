import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DemandePrestationService } from '../../../services/demande-prestation.service';
import { NgIf, NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-votre-devis',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './votre-devis.component.html',
  styleUrl: './votre-devis.component.scss'
})
export class VotreDevisComponent implements OnChanges {

  form: FormGroup;
  check = false;
  @Output() messageEvent = new EventEmitter<number>();
  @Output() dataEvent = new EventEmitter<any>();
  prestations: any;
  @Input() infoVehiculeData: any;
  @Input() idType: any;
  @Input() idModele: any;
  selectedPrestations: string[] = [];
  totalPrix: number = 0;
  idDevis: any = "mamamia";

  constructor(
    private formBuilder: FormBuilder,
    private demandePrestationService: DemandePrestationService,
    private localStorageService: LocalStorageService,
  )
  {
    this.form = this.formBuilder.group({
      idPrestation: [[]],
    });

  }  
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['idType'] || changes['idModele']) {
      this.getPrestation(this.idType, this.idModele);
    }
  }

  ngOnInit() {
    // Initialize the form group
    this.form = new FormGroup({});

    if (this.prestations && Array.isArray(this.prestations)) {
      // Dynamically add form controls for each prestation
      this.prestations.forEach((category: any) => {
        category.prestations.forEach((prestation: any) => {
          this.form.addControl(prestation._id, new FormControl(prestation.selected || false));
        });
      });
    } else {
      console.error("prestations data is not available or not an array.");
    }
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

  getPrestation(idType: any, idModele: any) {

    if (!idType || !idModele) {
      return;  // Stop further execution if validation fails
    }

    this.demandePrestationService.getPrestation(idType, idModele).subscribe({
      next: (data: any) => {

        console.log(data);
        
        if (Array.isArray(data) && data.length > 0) {
          this.prestations = [];
  
          this.prestations = this.formatPrestations(data).data.slice(1); // Remove first element (typemoteur, modele)
  
        } else {
          console.error("Invalid data format or data is empty:", data);
        }

      },
      error: (err: any) => {
        console.error("Error fetching prestation:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err?.error.message || "Une erreur s'est produite lors de la récupération des prestations.",  // Show error message from API
        });
        this.messageEvent.emit(1);
      }
    });
  }
  

  formatPrestations(data: any[]): any {
    if (!data || data.length === 0) return { data: [] };
  
    // Extract typemoteur and modele
    const typemoteur = data.length > 0 ? data[0].typemoteur : null;
    const modele = data.length > 0 ? data[0].modele : null;
  
    // Group prestations by categorieprestation
    const groupedPrestations = data.reduce((acc, item) => {
      const { categorieprestation, _id, nom, prixunitaire } = item;
  
      if (!acc[categorieprestation]) {
        acc[categorieprestation] = {
          categorieprestation,
          prestations: []
        };
      }
  
      acc[categorieprestation].prestations.push({ _id, nom, prixunitaire });
      return acc;
    }, {});
  
    return {
      data: [
        { typemoteur, modele },
        ...Object.values(groupedPrestations)
      ]
    };
  }
  

  isInfoPersoValid() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  
    return (
      this.form.get('idPrestation')?.valid
    );
  }

  demandeDevis(infoVehicule: any): any {
    try {
      const iduser = this.localStorageService.getLoginInfo()?.iduser;
  
      this.demandePrestationService.demandeDevis(
        infoVehicule.immatriculation,
        infoVehicule.idType,
        infoVehicule.idModele,
        iduser,
        this.selectedPrestations
      ).subscribe({
        next: (response) => {
          console.log('Devis créé avec succès:', response);

          // Extract ID and total price from response
          this.idDevis = response.devis._id;

          this.dataEvent.emit(this.idDevis);
  
          // Show Swal confirmation popup
          Swal.fire({
            title: 'Devis créé avec succès!',
            text: `Prix total: ${this.totalPrix} Ar. Voulez-vous accepter ce devis?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Accepter',
            cancelButtonText: 'Refuser',
          }).then((result) => {
            if (result.isConfirmed) {
              this.acceptezDevis(this.idDevis);
            }else{
              this.totalPrix = 0;
              this.prestations.forEach((category: any) => {
                category.prestations.forEach((prestation: any) => {
                  prestation.selected = false; 
                });
              });
              this.messageEvent.emit(2);
            }
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error.error,
          });
        }
      });
  
    } catch (error) {
      console.error('Erreur dans demandeDevis:', error);
    }
  }

  
  acceptezDevis(idDevis: any): void {
    this.demandePrestationService.acceptezDevis(idDevis).subscribe({
      next: (response) => {
        console.log('Devis accepté avec succès:', response);
        Swal.fire('Succès!', 'Le devis a été accepté avec succès.', 'success');
      },
      error: (err) => {
        console.error('Erreur lors de l’acceptation du devis:', err);
        Swal.fire('Erreur', 'Une erreur est survenue lors de l’acceptation du devis.', 'error');
      }
    });
  }
  


  togglePrestationSelection(event: any, prestation: any) {
    if (event.target.checked) {
      // Add prestation ID if checked
      this.selectedPrestations.push(prestation);
      this.totalPrix += prestation.prixunitaire;
    } else {
      // Remove prestation ID if unchecked
      this.selectedPrestations = this.selectedPrestations.filter(id => id !== prestation);
    }

    this.form.patchValue({ idPrestation: this.selectedPrestations });
  }

  previous(): void {
    this.messageEvent.emit(1);
  }

  next(): void {
    this.check = true;
  
    if (this.selectedPrestations.length > 0) { 
      this.demandeDevis(this.infoVehiculeData);
      
      this.messageEvent.emit(3);
      this.dataEvent.emit(this.idDevis);

    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Aucune prestation sélectionnée',
        text: 'Veuillez choisir au moins une prestation avant de continuer.',
        confirmButtonText: 'OK'
      });
    }
  }

}
