import { Component, OnInit, HostListener, Input} from '@angular/core';

import { Esquema, Formulario } from 'src/app/class/Esquema/esquema';
import {LoginService,} from '../Services/Usuario/login.service'; 
import {InventarioService} from '../Services/inv/inventario.service'; 



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
 // template: `<app-descargue></app-descargue>`,
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {

  private lstEsquema :  Esquema[] = [];
  Esquema !:Esquema; 
  
 



 // element!: HTMLElement;




  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {
    if (!this.href || this.href == '#' || (this.href && this.href.length === 0)) {
      var element = <HTMLElement>event.target;
 
      if(element.tagName  == "A" && element.getAttribute("href") == "#"){
        this.AbrirForm(element.id);   
      }  
      

      event.preventDefault();
    }
  }




  

 
  constructor(private loginserv : LoginService, private InventarioService : InventarioService) {
    let _Esquema : Esquema;

    _Esquema = new Esquema("SIS", "Configuración", false, new Formulario("LinkUsuario", "Usuario", false));
    this.lstEsquema.push(_Esquema);
  

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkDescargue", "Descargue", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxing", "Bundle Boxing", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkOtro", "Otro", false));
    this.lstEsquema.push(_Esquema);
  

    


    this.Esquema = _Esquema;
    this.Esquema._Esquema = "";
    this.Esquema._Activo = false;
    this.Esquema._Nombre = "";


  }

  AbrirForm(_Id : string)
  {

    if(_Id == "") return;

    let a = document.getElementsByTagName('a');
    Array.from(a).forEach((element) => {
      element?.classList.remove("active");
  });



  document.getElementById(_Id)?.parentElement?.classList.remove("active");
  document.getElementById(_Id)?.classList.remove("active");


  if(this.Esquema._Esquema == "SIS")
  {
    if(_Id != "LinkUsuario" && _Id != "LinkRegistrosUsuario"){
      this.loginserv.Cerrar();
  
    }

  }


  if(this.Esquema._Esquema == "INV")
  {
    if(_Id != "LinkDescargue"){
      this.InventarioService.Cerrar("LinkDescargue");
    }

    if(_Id != "LinkBundleBoxing"){
      this.InventarioService.Cerrar("LinkBundleBoxing");
    }

    
  }


  this.Esquema.ActivarForm(_Id);

  let element!: HTMLElement;

    switch(this.Esquema._Esquema){

      case "SIS":
        switch(_Id)
        {
          case "LinkUsuario":

            if(this.loginserv.isOpen && this.loginserv.str_Form != "frmUsuario") this.loginserv.Cerrar();
              
            this.loginserv.Abrir("frmUsuario");

          break;

          case "LinkRegistrosUsuario":

            if(this.loginserv.isOpen && this.loginserv.str_Form != "frmRegistros") this.loginserv.Cerrar();
              
            this.loginserv.Abrir("frmRegistros");

          break;

        }
        break;


      case "INV":
        switch(_Id)
        {
          case "LinkDescargue":
            this.InventarioService.Abrir("LinkDescargue");
          break;
          
          case "LinkBundleBoxing":
            this.InventarioService.Abrir("LinkBundleBoxing");
            break;

          case "LinkOtro":

          break;
        }
        break;
    }

    element = <HTMLElement>document.getElementById(_Id)?.parentElement?.parentElement?.parentElement;
    element.classList.add("active");
    document.getElementById(_Id)?.classList.add("active");
    


    
  }

  Salir()
  {
    this.loginserv.CerrarSession();
  }


  Modulo(m : string)
  {

    this.Esquema =  <Esquema>this.lstEsquema.find(x => x._Esquema == m);
    

    switch(m){

      case "SIS":
        if(this.InventarioService.isOpen) this.InventarioService.CerrarTodo();
        this.Esquema._Nombre = "Configuración"
        break;

      case "INV":
        if(this.loginserv.isOpen) this.loginserv.Cerrar();
        this.Esquema._Nombre = "Inventario"
        break;
    }
  }

  mouseEnter(a : string)
  {
  /*  this.element = <HTMLElement>document.getElementById(a);
    this.element.setAttribute("style", 'background-color: #E2E2E2;');*/

    
  }

  mouseLeave(a : string)
  {
  /*  this.element = <HTMLElement>document.getElementById(a);
    this.element.setAttribute("class", 'nav-item');*/
  }

 
  ngOnInit(): void {

    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });

    this.loginserv.TimeOut(300, 30);

  }



}
