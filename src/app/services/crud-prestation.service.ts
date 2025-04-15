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
}
