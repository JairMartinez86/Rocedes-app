import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Conexion } from '../../class/Cnx/conexion';
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


      case "LinkBundleBoxing":
        this.change.emit("Open:BundleBoxing");
        break;

      case "LinkBundleBoxingComplemento":
        this.change.emit("Open:BundleBoxingComplemento");
        break;

      case "LinkReportBundleBoxing":
        this.change.emit("Open:LinkReportBundleBoxing");
        break;

      case "LinkBundleBoxingSaco":
        this.change.emit("Open:LinkBundleBoxingSaco");
        break;

      case "LinkBundleBoxingSerial":
        this.change.emit("Open:LinkBundleBoxingSerial");
        break;

      case "LinkBundleBoxingEnvio":
        this.change.emit("Open:LinkBundleBoxingEnvio");
        break;
      
      case "LinkProcesoTendidoFactor":
        this.change.emit("Open:LinkProcesoTendidoFactor");
        break;

      case "LinkProcesoTendidoCapaSencilla":
        this.change.emit("Open:LinkProcesoTendidoCapaSencilla");
        break;

      case "LinkProcesoTendidoCapaDoble":
        this.change.emit("Open:LinkProcesoTendidoCapaDoble");
        break;

      case "LinkProcesoCorteFactor":
        this.change.emit("Open:LinkProcesoCorteFactor");
        break;
        
    }
    
  }
  
  Cerrar(frm : string) {
    
    switch(frm){


      case "LinkBundleBoxing":
        this.change.emit("Close:BundleBoxing");
        break;

        


      case "LinkBundleBoxingComplemento":
        this.change.emit("Close:BundleBoxing");
        break;

      case "LinkReportBundleBoxing":
        this.change.emit("Close:LinkReportBundleBoxing");
        break;


      case "LinkBundleBoxingSaco":
        this.change.emit("Close:LinkBundleBoxingSaco");
        break;

      case "LinkBundleBoxingSerial":
        this.change.emit("Close:LinkBundleBoxingSerial");
        break;


      case "LinkBundleBoxingEnvio":
        this.change.emit("Close:LinkBundleBoxingEnvio");
        break;


      case "LinkProcesoTendidoFactor":
        this.change.emit("Close:LinkProcesoTendidoFactor");
        break;
       
      case "LinkProcesoTendidoCapaSencilla":
        this.change.emit("Close:LinkProcesoTendidoCapaSencilla");
        break;

      case "LinkProcesoTendidoCapaDoble":
        this.change.emit("Close:LinkProcesoTendidoCapaDoble");
        break;

      case "LinkProcesoCorteFactor":
        this.change.emit("Close:LinkProcesoCorteFactor");
        break;

        
    }
  }

  CerrarTodo(){
    this.change.emit("Close:BundleBoxing");
    this.change.emit("Close:LinkReportBundleBoxing");
    this.change.emit("Close:BundleBoxingSaco");
    this.change.emit("Close:BundleBoxingSerial");
    this.change.emit("Close:LinkBundleBoxingEnvio");
    this.change.emit("Close:LinkProcesoTendidoFactor");
    this.change.emit("Close:LinkProcesoTendidoCapaSencilla");
    this.change.emit("Close:LinkProcesoTendidoCapaDoble");
    this.change.emit("Close:LinkProcesoCorteFactor");
    
  }









  
  GetMaterial(IdPresentacion: string): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Inventario/Material/Get" + "?IdPresentacionSerial=" + IdPresentacion);

  }

  GetPresentacionSerial(): Observable<any> {

    return this.http.get<any>(this.Cnx.Url() + "Inventario/PresentacionSerial/Get");

  }

  
  
}
