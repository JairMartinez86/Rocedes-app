import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { IFactorCorte } from 'src/app/main/class/Form/PRM/i-Factor-Corte';
import { IFactorCorteDetalle } from 'src/app/main/class/Form/PRM/i-Factor-Corte-Detalle';

@Injectable({
  providedIn: 'root'
})
export class FactorCorteService {

 
  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Premium/ProcesoCorte/Get");
  }

  GetDetalle(IdFactorDetalleCorte: number): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Premium/ProcesoCorte/GetDetalle" + "?IdFactorDetalleCorte="+IdFactorDetalleCorte);

  }
     
  GetAuto(filtro: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Premium/ProcesoCorte/GetAuto" + "?filtro="+filtro);

  }

  GuardarFactor(d : IFactorCorte): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/ProcesoCorte/GuardarFactor" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }

  EliminarDetalle(id : number): Observable<any> {
       
    return this.http.post<any>(this.Cnx.Url() + "Premium/ProcesoCorte/EliminarDetalle" + "?id=" + id,  { 'content-type': 'application/text'});
    

  }

  GuardarDetalle(d : IFactorCorteDetalle): Observable<any> {
       
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Premium/ProcesoCorte/GuardarDetalle" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }
}
