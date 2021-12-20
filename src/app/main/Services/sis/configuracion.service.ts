import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Conexion } from '../../class/Cnx/conexion';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  


  @Output() change: EventEmitter<string> = new EventEmitter();

  private Cnx : Conexion = new Conexion();
  

  isOpen : boolean = false;
  str_Form : string = "";

  constructor(private http: HttpClient) { }

    
  Abrir(frm : string) {
    this.isOpen = true;
    this.str_Form = frm;
    
    
    switch(frm){


      case "LinkUsuarioPerfil":
        this.change.emit("Open:LinkUsuarioPerfil");
        break;

        
    }
    
  }
  
  Cerrar(frm : string) {
    
    switch(frm){


      case "LinkUsuarioPerfil":
        this.change.emit("Close:LinkUsuarioPerfil");
        break;

    }
  }

  CerrarTodo(){
    this.change.emit("Close:LinkUsuarioPerfil");
 
    
  }









  

}
