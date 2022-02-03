import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from '../../shared/class/Cnx/conexion';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/SerialComponente/Get");
  }

  SubirArchivo(d : any): Observable<any> {
    return this.http.post<any>(this.Cnx.Url() + "Pln/Planing/SubirArchivo", JSON.stringify(d), { headers: {'content-type' : 'application/json'}});
  }
}
