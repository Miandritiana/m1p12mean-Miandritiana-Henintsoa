import { Component, OnInit } from '@angular/core';
import { NgFor, NgStyle, NgIf } from '@angular/common';

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
  TableDirective
} from '@coreui/angular';
import { CrudPrestationService } from '../../../services/crud-prestation.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-prestation',
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
    TableDirective,
    NgFor, NgStyle, NgIf,
    FormsModule
  ],
  templateUrl: './gestion-prestation.component.html',
  styleUrl: './gestion-prestation.component.scss'
})
export class GestionPrestationComponent implements OnInit{

  newPrestation = {
    nom: '',
    idtypemoteur: '',
    idmodele: '',
    idcategorieprestation: '',
    prixunitaire: 0
  };

  prestations: any[] = [];
  typeMoteur: any[] = [];
  modeles: any[] = [];
  categoriePrestation: any[] = [];

  editedIndex: number | null = null;

  constructor(private crudPrestationService: CrudPrestationService) { }

  ngOnInit() {
    this.loadPrestation();
    this.loadTypeMoteur();
    this.loadModeles();
    this.loadCategorie();
  }

  //get rht
  loadPrestation() {
    this.crudPrestationService.getPrestation().subscribe(data => {
        this.prestations = data;
      }
    )
  }
  loadTypeMoteur() {
    this.crudPrestationService.getTypeMoteur().subscribe(data => {
      this.typeMoteur = data;
    })
  }
  loadModeles() {
    this.crudPrestationService.getModele().subscribe(data => {
      this.modeles = data;
    })
  }
  loadCategorie() {
    this.crudPrestationService.getCategoriePrestation().subscribe(data => {
      this.categoriePrestation = data;
    })
  }

  resetForm() {
    this.newPrestation = {
      nom: '',
      idtypemoteur: '',
      idmodele: '',
      idcategorieprestation: '',
      prixunitaire: 0
    }
  }

  addPrestation() {
    if (
      !this.newPrestation.nom ||
      !this.newPrestation.idtypemoteur ||
      !this.newPrestation.idmodele ||
      !this.newPrestation.idcategorieprestation ||
      !this.newPrestation.prixunitaire
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    this.crudPrestationService.addPrestation(this.newPrestation).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'La prestation a été ajoutée avec succès.',
          confirmButtonColor: '#28a745'
        });
        this.loadPrestation();
        this.resetForm();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error?.error?.message || 'Une erreur est survenue lors de l\'ajout de la prestation.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }
  

  editPrestation(index: number): void {
    this.editedIndex = index;
  }

  editPrestationValider(prestation: any) {
  }

  confirmDeletePrestation(idPrestation: any) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePrestation(idPrestation);
      }
    });
  }
  
  deletePrestation(idPrestation: any) {
    this.crudPrestationService.deletePrestation(idPrestation).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'La prestation a été supprimée avec succès.',
          confirmButtonColor: '#28a745'
        });
        this.loadPrestation(); // Recharge la liste
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: err?.error?.error || 'Une erreur est survenue lors de la suppression.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  
}
