import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { University } from '../modules/universities/universities.component';

@Injectable({
  providedIn: 'root'
})

export class RestService {

  constructor(private http: HttpClient) { }

  getUniversities(country: string, name: string = '',): Observable<University[]> {
    return this.http.get<University[]>(`http://universities.hipolabs.com/search?${name ? 'name=' + name + '&': '' }country=${country}`);
  }

}
