import { Overlay } from '@angular/cdk/overlay';
import { ComponentFactoryResolver, EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { BundleBoxingComponent } from 'src/app/main/inv/bundle-boxing/bundle-boxing.component';
import { DescargueComponent } from 'src/app/main/inv/descargue/descargue.component';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  @ViewChild(DescargueComponent)DescargueComp!: DescargueComponent; 
  @ViewChild(BundleBoxingComponent)BundleBoxingComp!: BundleBoxingComponent; 


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
       
    }
  }

  CerrarTodo(){
    this.change.emit("Close:Descargue");
    this.change.emit("Close:BundleBoxing");
  }
}
