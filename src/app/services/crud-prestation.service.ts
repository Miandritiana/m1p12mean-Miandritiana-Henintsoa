import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudPrestationService {

  private url= Constants.BASE_URL;

  constructor(private http: HttpClient) { }

  getPrestation(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/prestation');
  }

  getTypeMoteur(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/typemoteur');
  }
  getModele(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/modele');
  }
  getCategoriePrestation(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/categorieprestation');
  }

  addPrestation(prestation: any): Observable<any> {
    return this.http.post<any>(this.url + '/prestation', prestation);
  }

  deletePrestation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/prestation/${id}`);
  }
  
  editPrestation(idPrestation: string, prestation: any): Observable<any> {
    return this.http.put<any>(`${this.url}/prestation/${idPrestation}`, prestation);
  }
}
