import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { ICodigoGSD } from 'src/app/main/class/Form/Inv/Interface/i-Codigo-GSD';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }


  GetCodigoGSD() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/Operaciones/GetCodigoGSD");
  }



  GuardarCodigoGSD(d : ICodigoGSD): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/Operaciones/GuardarCodigoGSD" + "?d=" + json,  { 'content-type': 'application/json'});
  }

}
