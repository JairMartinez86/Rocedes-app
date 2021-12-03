import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from 'src/app/class/Cnx/conexion';
@Injectable({
  providedIn: 'root'
})
export class InventarioService {



  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();
  

  isOpen : boolean = false;
  str_Form : string = "";

  constructor(private http: HttpClient) { }

    
  Abrir(frm : string) {
    this.isOpen = true;
    this.str_Form = frm;
    
    
    switch(frm){

      case "LinkDescargue":
        this.change.emit("Open:Descargue");
        break;
        

      case "LinkBundleBoxing":
        this.change.emit("Open:BundleBoxing");
        break;

        case "LinkReportBundleBoxing":
        this.change.emit("Open:LinkReportBundleBoxing");
        break;
       
    }
    
  }
  
  Cerrar(frm : string) {
    
    switch(frm){

      case "LinkDescargue":
        this.change.emit("Close:Descargue");
        break;
        

      case "LinkBundleBoxing":
        this.change.emit("Close:BundleBoxing");
        break;

        case "LinkReportBundleBoxing":
          this.change.emit("Close:LinkReportBundleBoxing");
          break;
       
    }
  }

  CerrarTodo(){
    this.change.emit("Close:Descargue");
    this.change.emit("Close:BundleBoxing");
    this.change.emit("Close:LinkReportBundleBoxing");
  }









  
  GetMaterial(IdPresentacion: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Inventario/Material/Get" + "?IdPresentacionSerial=" + IdPresentacion);

  }

  GetPresentacionSerial(): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Inventario/PresentacionSerial/Get");

  }

  
  
}
