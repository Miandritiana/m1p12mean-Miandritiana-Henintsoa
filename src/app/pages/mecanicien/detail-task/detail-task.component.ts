import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CardBodyComponent, CardComponent ,
  ColComponent,
  RowComponent,
  ModalModule,
} from '@coreui/angular';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MecanicienService } from '../../../services/mecanicien.service';
import { NgFor, NgStyle, NgIf, NgClass } from '@angular/common';
import { FormatCurrencyPipe } from '../../../validator/FormatCurrencyPipe';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-task',
  standalone: true,
  imports: [
    CardComponent, 
    CardBodyComponent,
    ColComponent,
    RowComponent,
    NgFor, NgStyle, NgIf, NgClass,
    FormatCurrencyPipe,
    ModalModule,
    FormsModule
  ],
  templateUrl: './detail-task.component.html',
  styleUrl: './detail-task.component.scss'
})
export class DetailTaskComponent implements OnChanges {

  listDetail: any = {};
  idrendezvous: string = '';
  @Input() idRdv: string = '';
  prestationResult: any = [];
  showModal: boolean = false;
  selectedPrestation: string = '';
  @Output() dataEvent = new EventEmitter<any>();

  constructor (
    private mecanicienService: MecanicienService,
    private localStorageService : LocalStorageService,
    private route: ActivatedRoute,
  ) 
  {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idRdv']) {
      this.getDetail(changes['idRdv'].currentValue);
    }

    console.log('Selected prestation:', this.selectedPrestation);

  }

  isAppear(): boolean {
    if(this.idRdv) {
      return true;
    }
    return false;
  }

  goBack() {
    this.dataEvent.emit(true);
  }

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

  getDetail(idrendezvous: string) {
    this.mecanicienService.detailTache(idrendezvous).subscribe(
      (data: any)=> {
        this.listDetail = data;
      }
    )
  }


  avancer(idprestation: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment changer l'avancement de cette prestation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, changer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appeler le service si confirmé
        this.mecanicienService.avancement(this.idRdv, idprestation).subscribe(
          (response) => {
            Swal.fire({
              title: 'Succès',
              text: response?.message || 'Avancement mis à jour avec succès !',
              icon: 'success'
            });
            // this.getDetail(this.idRdv);
            const prestation = this.listDetail.prestations.find((p: { idprestation: string; }) => p.idprestation === idprestation);
            if (prestation) {
              prestation.avancement = response.nouveauAvancement ?? prestation.avancement + 1; // Utiliser la valeur du backend ou incrémenter
            }
          },
          (error) => {
            Swal.fire({
              title: 'Erreur',
              text: error?.error.message || 'Une erreur est survenue lors de la mise à jour.',
              icon: 'error'
            });
          }
        );
      }
    });
  }
  

  deletePrestation(idprestation: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible. Voulez-vous supprimer cette prestation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mecanicienService.deletePrestation(this.idRdv, idprestation).subscribe(
          (response) => {
            Swal.fire({
              title: 'Supprimé !',
              text: response?.message || 'La prestation a été supprimée avec succès.',
              icon: 'success'
            });
            this.listDetail.prestations = this.listDetail.prestations.filter((p: { idprestation: string; }) => p.idprestation !== idprestation);
          },
          (error) => {
            Swal.fire({
              title: 'Erreur',
              text: error?.error.message || 'Une erreur est survenue lors de la suppression.',
              icon: 'error'
            });
          }
        );
      }
    });
  }
  

  addPrestation(idtypemoteur: string, idmodele: string) {
    this.mecanicienService.prestationByModeleAndTypemoteur(idtypemoteur, idmodele).subscribe(
      (data: any) => {
        this.prestationResult = data;
      }
    );
    console.log(this.prestationResult);
    this.showModal = true;
  }

  closeModal(){
    this.showModal = false;
  }

  onPrestationSelect(prestation: any) {
    this.selectedPrestation = prestation.idprestation; // Stocker l'ID de la prestation sélectionnée
  }
  

  selectPrestation(prestation: any) {
    console.log("prestation aoslifnas", prestation);
    
    this.selectedPrestation = prestation._id;
    console.log(this.selectedPrestation);
  }

  addPrestationConfirme() {
    this.mecanicienService.addPrestation(this.idRdv, this.selectedPrestation).subscribe(
      (response) => {
        Swal.fire({
          title: 'Succès',
          text: response?.message || 'Une nouvelle prestation ajouter !',
          icon: 'success'
        });
        this.showModal = false;
        this.getDetail(this.idRdv);
      },
      (error) => {
        Swal.fire({
          title: 'Erreur',
          text: error?.error.message || 'Une erreur est survenue lors de la mise à jour.',
          icon: 'error'
        });
      }
    );
  }


}
