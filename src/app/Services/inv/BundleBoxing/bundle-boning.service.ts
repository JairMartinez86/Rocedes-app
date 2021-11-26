import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/class/Cnx/conexion';

@Injectable({
  providedIn: 'root'
})
export class BundleBoningService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

  GetSerialesEscaneado(str_corte: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "BundleBoxing/GetSerialesEscaneado" + "?corte="+str_corte);

  }


  Saco(str_usuario: string, str_Corte : string, str_Seccion : string, str_Saco : string): Observable<any> {
       
    return this.http.post<any>(this.Cnx.Url() + "BundleBoxing/Saco" + "?usuario=" + str_usuario  + "&corte="+str_Corte + "&seccion=" + str_Seccion + "&saco=" + str_Saco,  { 'content-type': 'application/text'});

  }


}
