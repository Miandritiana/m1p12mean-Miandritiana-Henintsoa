import { Component, OnInit } from '@angular/core';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { CrudPrestationService } from '../../../services/crud-prestation.service';

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
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-categorie-prestation',
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
  templateUrl: './categorie-prestation.component.html',
  styleUrl: './categorie-prestation.component.scss'
})
export class CategoriePrestationComponent implements OnInit {

  constructor(private crudPrestationService: CrudPrestationService) { }

  newCategorie = {
    nom: ''
  }

  categoriePrestation: any[] = [];

  ngOnInit() {
    this.loadCategorie();
  }

  resetForm() {
    this.newCategorie = {
      nom: ''
    }
  }
  loadCategorie() {
    this.crudPrestationService.getCategoriePrestation().subscribe(data => {
      this.categoriePrestation = data;
    })
  }

  addCategorie() {
    if (!this.newCategorie.nom) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    this.crudPrestationService.addCategoriePrestation(this.newCategorie.nom).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: `La catégorie '${response.nom}' a été ajoutée avec succès.`, // Showing the response message
          confirmButtonColor: '#28a745'
        });
        this.loadCategorie(); // Reload categories after adding a new one
        this.resetForm(); // Reset form after successful addition
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: err?.error?.message || 'Une erreur s\'est produite lors de l\'ajout de la catégorie.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  

  deleteCategorrieprestation(idcate: string) {

  }


}
