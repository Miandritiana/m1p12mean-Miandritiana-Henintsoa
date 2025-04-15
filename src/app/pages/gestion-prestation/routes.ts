import { Routes } from "@angular/router";
import { GestionPrestationComponent } from "./gestion-prestation/gestion-prestation.component";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: '',
                component: GestionPrestationComponent,
                data: {
                    title: 'Gestion Prestation'
                }
            }
        ]
    }
];