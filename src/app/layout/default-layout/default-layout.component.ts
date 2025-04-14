import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import {LoaderComponent} from 'src/app/layout/loader/loader.component'
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { LocalStorageService } from '../../services/local-storage.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    LoaderComponent
  ]
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public menuDynamique:any=[];
  public static nombre=0;

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
  constructor(
    private localStorageService : LocalStorageService
  ){ 
    
    DefaultLayoutComponent.nombre++;
    var role=this.localStorageService.getLoginInfo()?.role ?? '';

    const menuByRole: Record<string, any[]> = {
      "1": [
        { title: true, name: 'Client' },
        {
          name: 'Acceuil',
          url: '/acceuil',
          iconComponent: { name: 'cil-home' },
        },
        {
          name: 'Suivi',
          url: '/suivi',
          iconComponent: { name: 'cil-check-circle' },
        },
      ],
      "3": [
        { title: true, name: 'Manager' },
        {
          name: 'Demande préstation',
          url: '/demande-prestation-manager',
          iconComponent: { name: 'cil-file' },
        },
        {
          name: 'Parametrage',
          url: '/parametre',
          iconComponent: { name: 'cil-settings' },
          children: [
            {
              name: 'Mécanicien',
              url: '/parametre-mecanicien',
              icon: 'nav-icon-bullet',
            },
            {
              name: 'Préstation',
              url: '/parametre-prestation',
              icon: 'nav-icon-bullet',
            },
          ],
        },
        {
          name: 'Historique',
          url: '/histo-prestation',
          iconComponent: { name: 'cil-list' },
        },
      ],
      "2": [
        { title: true, name: 'Mécanicien' },
        {
          name: 'Tache',
          url: '/tache',
          iconComponent: { name: 'cil-task' },
        },
        {
          name: 'Changer mot de passe',
          url: '/change-mdp',
          iconComponent: { name: 'cil-pencil' },
        },
      ],
    };

    // Assign menu dynamically based on role, fallback to an empty array if role is not found
    this.menuDynamique = menuByRole[role] || [];

  }
}
