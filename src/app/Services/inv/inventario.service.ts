import { EventEmitter, Injectable, Output } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class InventarioService {



  @Output() change: EventEmitter<string> = new EventEmitter();

  isOpen : boolean = false;
  str_Form : string = "";

  constructor() { }

    
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
}
