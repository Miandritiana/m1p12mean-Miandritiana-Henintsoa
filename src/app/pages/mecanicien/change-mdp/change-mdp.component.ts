import { Component, OnInit } from '@angular/core';

import { CardBodyComponent, CardComponent , CardHeaderComponent,
  ColComponent,
  RowComponent,
  ModalModule,
} from '@coreui/angular';

import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import Swal from 'sweetalert2';
import { CrudMecanicienService } from '../../../services/crud-mecanicien.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-mdp',
  standalone: true,
  imports: [FormsModule, CardBodyComponent, CardComponent , CardHeaderComponent,
    ColComponent,
    RowComponent,
    ModalModule],
  templateUrl: './change-mdp.component.html',
  styleUrl: './change-mdp.component.scss'
})
export class ChangeMdpComponent implements OnInit {

  oldPassword: string = '';
  newPassword: string = '';
  iduser: string;

  constructor(
    private router: Router, 
    private localStorageService: LocalStorageService,
    private crudMecanicienService: CrudMecanicienService
  ) { 
    this.iduser = this.localStorageService.getLoginInfo()?.iduser ?? '';
  }
  ngOnInit(): void {

    const userRole = this.localStorageService.getLoginInfo()?.role ?? '';
    const iduser = this.localStorageService.getLoginInfo()?.iduser ?? '';

    if (iduser === '') {
      Swal.fire({
        icon: 'error',
        title: 'Vous n\'êtes pas connecter.',
        text: 'Vous devez vous connecter.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }


    // this.change(iduser, '1234', '1234');
  }

  handleChangePassword() {
    if (!this.oldPassword || !this.newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis!',
        text: 'Veuillez remplir tous les champs.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.crudMecanicienService.newPassword(this.iduser, this.oldPassword, this.newPassword)
    .subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: res?.message || 'Mot de passe changé avec succès.', // Show exact response
          confirmButtonColor: '#28a745'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: err.error?.message || err.message || 'Une erreur s\'est produite.', // Show exact error response
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}
