import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { IFactorCorte } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Corte';

@Injectable({
  providedIn: 'root'
})
export class FactorCorteService {

 
  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/ProcesoCorte/Get");
  }


  Eliminar(d : IFactorCorte): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/ProcesoCorte/Eliminar" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }

  Guardar(d : IFactorCorte): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/ProcesoCorte/Guardar" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }
}
