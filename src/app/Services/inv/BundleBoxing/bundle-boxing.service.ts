import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/class/Cnx/conexion';
import { ClsBundleBoxing } from 'src/app/class/Form/Inv/cls-bundle-boxing';
import { ClsSacoEstado } from 'src/app/class/Form/Inv/cls-saco-estado';

@Injectable({
  providedIn: 'root'
})
export class BundleBoningService {

  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  GetSerialesEscaneado(str_corte: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "BundleBoxing/GetSerialesEscaneado" + "?corte="+str_corte);

  }


  Saco(SacoEstado : ClsSacoEstado): Observable<any> {
       
    let json = JSON.stringify(SacoEstado);  
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/Saco" + "?d=" + json,  { 'content-type': 'application/json'});

  }


  Pieza(Boxing : ClsBundleBoxing): Observable<any> {
       
    let json = JSON.stringify(Boxing);  
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/GuardarPieza" + "?d=" + json,  { 'content-type': 'application/json'});

  }
  


}
