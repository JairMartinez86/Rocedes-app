import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { ICodigoGSD } from 'src/app/main/class/Form/Inv/Interface/i-Codigo-GSD';
import { IPartes } from 'src/app/main/class/Form/Inv/Interface/i-Partes';
import { ITela } from 'src/app/main/class/Form/Inv/Interface/i-Tela';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }



  //#region CODIGO GSD
  GetCodigoGSD() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/Operaciones/GetCodigoGSD");
  }



  GuardarCodigoGSD(d : ICodigoGSD): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/Operaciones/GuardarCodigoGSD" + "?d=" + json,  { 'content-type': 'application/json'});
  }
  //#endregion CODIGO GSD


    //#region PARTES
    GetPartes() : Observable<any>
    {
      return this.http.get<any>(this.Cnx.Url() + "Inventario/Operaciones/GetPartes");
    }
  
  
  
    GuardarPartes(d : IPartes): Observable<any> { 
      let json = JSON.stringify(d);  
      return this.http.post<any>(this.Cnx.Url() + "Inventario/Operaciones/GuardarPartes" + "?d=" + json,  { 'content-type': 'application/json'});
    }
    //#endregion PARTES



  //#region TELA
  
    GetTela() : Observable<any>
    {
      return this.http.get<any>(this.Cnx.Url() + "Inventario/Operaciones/GetTela");
    }



    GuardarTela(d : ITela): Observable<any> { 
      let json = JSON.stringify(d);  
      return this.http.post<any>(this.Cnx.Url() + "Inventario/Operaciones/GuardarTela" + "?d=" + json,  { 'content-type': 'application/json'});
     }
  //#endregion TELA
  

}
