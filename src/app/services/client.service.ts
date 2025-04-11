import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url= Constants.BASE_URL;

  constructor(private http: HttpClient) { }

  rendezVousAttente(idclient: string): Observable<any> {
    return this.http.get<any>(`${this.url}/rendezvous/enattente/${idclient}`);
  }

  listNewProposeDate(idclient: string): Observable<any> {
    return this.http.get<any>(`${this.url}/rendezvous/proposition/${idclient}`);
  }
  
  accepetDatePropose(idRdv: string, idclient: string): Observable<any> {
    const data = {
      idrendezvous: idRdv,
      confirmation: 1,
      idclient: idclient
    }
    return this.http.post<any>(`${this.url}/rendezvous/confirmation`, data);
  }

  
}
