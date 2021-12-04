import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { ClsBundleBoxing } from 'src/app/main/class/Form/Inv/cls-bundle-boxing';
import { ClsSacoEstado } from 'src/app/main/class/Form/Inv/cls-saco-estado';
import { ClsSerialBoxing } from 'src/app/main/class/Form/Inv/Cls-Serial-Boxing';

@Injectable({
  providedIn: 'root'
})
export class BundleBoningService {

  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  GetSerialesEscaneado(str_corte: string, str_estilo : string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "BundleBoxing/GetSerialesEscaneado" + "?corte="+str_corte + "&estilo=" + str_estilo);

  }

  GetBundleBoxing(str_corte: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "BundleBoxing/GetBundleBoxing" + "?corte="+str_corte);

  }


  Saco(SacoEstado : ClsSacoEstado): Observable<any> {
       
    let json = JSON.stringify(SacoEstado);  
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/Saco" + "?d=" + json,  { 'content-type': 'application/json'});
    

  }


  Pieza(Boxing : ClsBundleBoxing): Observable<any> {
       
    let json = JSON.stringify(Boxing);  
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/Pieza" + "?d=" + json,  { 'content-type': 'application/json'});

  }


  GenerarSerial(Serial : ClsSerialBoxing): Observable<any> {
       
    let json = JSON.stringify(Serial);  
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/GenerarSerial" + "?d=" + json,  { 'content-type': 'application/json'});

  }
  
  





}
