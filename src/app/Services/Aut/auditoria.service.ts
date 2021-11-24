import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/class/Cnx/conexion';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient,) { }


    
  GetPOrder(str_corte: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Auditoria/GetAutoPOrder" + "?corte="+str_corte);

  }


  GetSerial2(str_corte: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Auditoria/GetSerial2" + "?corte="+str_corte);

  }


}
