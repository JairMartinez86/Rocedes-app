import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { IFactorFoleo } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Foleo';

@Injectable({
  providedIn: 'root'
})
export class FactorFoleoService {
  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/Foleo/Get");
  }


  Guardar(d : IFactorFoleo): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/Foleo/Guardar" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }

}