import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/main/class/Cnx/conexion';
import { IProducto } from 'src/app/main/class/Form/Inv/Interface/i-Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private Cnx : Conexion = new Conexion();

  constructor(private http: HttpClient) { }

    
  Get() : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/Producto/Get");
  }

  GetAuto(nombre : string) : Observable<any>
  {
    return this.http.get<any>(this.Cnx.Url() + "Inventario/Producto/GetAuto" + "?nombre=" + nombre);
  }



  Guardar(d : IProducto): Observable<any> { 
    let json = JSON.stringify(d);  
    return this.http.post<any>(this.Cnx.Url() + "Inventario/Producto/Guardar" + "?d=" + json,  { 'content-type': 'application/json'});
   }
}
