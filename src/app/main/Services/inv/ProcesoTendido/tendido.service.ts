import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { IFactorTendido } from 'src/app/main/class/Form/Inv/Interface/i-Factor-Tendido';

@Injectable({
  providedIn: 'root'
})
export class TendidoService {


  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/ProcesoTendido/Get");
  }


  Guardar(d : IFactorTendido): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/ProcesoTendido/Guardar" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }

}
