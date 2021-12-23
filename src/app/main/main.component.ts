import { Component, OnInit, HostListener, Input} from '@angular/core';

import { Esquema, Formulario } from 'src/app/main/class/Esquema/esquema';
import {LoginService,} from './Services/Usuario/login.service'; 
import {InventarioService} from './Services/inv/inventario.service'; 
import { IUsuarioPerfil } from './class/Form/sis/Interface/i-UsuarioPerfil';
import { DialogoComponent } from './otro/dialogo/dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfiguracionService } from './Services/sis/configuracion.service';


let ELEMENT_DATA_PERFIL_USUARIO: IUsuarioPerfil[] = [];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
 // template: `<app-descargue></app-descargue>`,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private lstEsquema :  Esquema[] = [];
  Esquema !:Esquema; 
  
  public NomUsuario : string = "";
  searchDrop = false;
 



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




  

 
  constructor(private loginserv : LoginService, private InventarioService : InventarioService, private _ConfiguracionService : ConfiguracionService,  private dialog : MatDialog) {
    

    this.loginserv.VerificarSession()
  
    let _Esquema : Esquema;

    _Esquema = new Esquema("SIS", "Configuración", false, new Formulario("LinkUsuario", "Usuario", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("SIS", "Configuración", false, new Formulario("LinkUsuarioPerfil", "Perfil", false));
    this.lstEsquema.push(_Esquema);
  



    
    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxing", "Bundle Boxing", false));
    this.lstEsquema.push(_Esquema);


    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkReportBundleBoxing", "Reporte Bundle Boxing", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxingSerial", "Seriales", false));
    this.lstEsquema.push(_Esquema);

    _Esquema = new Esquema("INV", "Inventario", true, new Formulario("LinkBundleBoxingEnvio", "Envio", false));
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

    if(_Id != "LinkUsuarioPerfil"){
      this._ConfiguracionService.Cerrar("LinkUsuarioPerfil");
  
    }

  }


  if(this.Esquema._Esquema == "INV")
  {

    if(_Id != "LinkBundleBoxing" && _Id != "LinkBundleBoxingComplemento"){
      this.InventarioService.Cerrar("LinkBundleBoxing");
    }

    
    if(_Id != "LinkReportBundleBoxing"){
      this.InventarioService.Cerrar("LinkReportBundleBoxing");
    }

    if(_Id != "LinkBundleBoxingSaco"){
      this.InventarioService.Cerrar("LinkBundleBoxingSaco");
    }

    if(_Id != "LinkBundleBoxingSerial"){
      this.InventarioService.Cerrar("LinkBundleBoxingSerial");
    }

    if(_Id != "LinkBundleBoxingEnvio"){
      this.InventarioService.Cerrar("LinkBundleBoxingEnvio");
    }

    if(_Id != "LinkProcesoTendidoFactor"){
      this.InventarioService.Cerrar("LinkProcesoTendidoFactor");
    }

    if(_Id != "LinkProcesoTendidoCapaSencilla"){
      this.InventarioService.Cerrar("LinkProcesoTendidoCapaSencilla");
    }

    if(_Id != "LinkProcesoTendidoCapaDoble"){
      this.InventarioService.Cerrar("LinkProcesoTendidoCapaDoble");
    }
    
    if(_Id != "LinkProcesoCorteFactor"){
      this.InventarioService.Cerrar("LinkProcesoCorteFactor");
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

          case "LinkUsuarioPerfil":

            this._ConfiguracionService.Abrir("LinkUsuarioPerfil");

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

          case "LinkBundleBoxing":
            this.InventarioService.Abrir("LinkBundleBoxing");
            break;

            case "LinkBundleBoxingComplemento":
              this.InventarioService.Abrir("LinkBundleBoxingComplemento");
              break;

            case "LinkReportBundleBoxing":
              this.InventarioService.Abrir("LinkReportBundleBoxing");
              break;

            case "LinkBundleBoxingSaco":
              this.InventarioService.Abrir("LinkBundleBoxingSaco");
              break;

            case "LinkBundleBoxingSerial":
              this.InventarioService.Abrir("LinkBundleBoxingSerial");
              break;

            case "LinkBundleBoxingEnvio":
              this.InventarioService.Abrir("LinkBundleBoxingEnvio");
              break;

            case "LinkProcesoTendidoFactor":
              this.InventarioService.Abrir("LinkProcesoTendidoFactor");
              break;

            case "LinkProcesoTendidoCapaSencilla":
              this.InventarioService.Abrir("LinkProcesoTendidoCapaSencilla");
              break;

            case "LinkProcesoTendidoCapaDoble":
              this.InventarioService.Abrir("LinkProcesoTendidoCapaDoble");
              break;

            case "LinkProcesoCorteFactor":
              this.InventarioService.Abrir("LinkProcesoCorteFactor");
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

    this.Perfiles();

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

  Perfiles() : void
  {

    ELEMENT_DATA_PERFIL_USUARIO.splice(0 , ELEMENT_DATA_PERFIL_USUARIO.length)
    this.loginserv.BuscarAcceso().subscribe( s =>{
    
      let _json = JSON.parse(s);
      
      if(_json["esError"] == 0)
      {
        if(_json["count"] > 0)
        {


          _json["d"].forEach((j : IUsuarioPerfil) => {
            ELEMENT_DATA_PERFIL_USUARIO.push(j);
          });
        }
      }
      else
      {
        this.dialog.open(DialogoComponent, {
          data : _json["msj"]
        })
      }

      this.Nodos(<Element>document.getElementById("Esquema"), true);
      this.Nodos(<Element>document.getElementById("NavControl"), false);

    });

  }


  Nodos(_element : Element, esEscquema : boolean) : void
  {


    for(var i = 0; i < _element.children.length; i++)
    {

      if(_element.children.length > 0)
      {
        this.Nodos(_element.children[i], esEscquema);

      }
    }


    if(_element.children.length <=1 && _element.id != "")
    {
    
      document.getElementById(_element.id)?.classList.add("NoVisible");

      if(esEscquema)
      {
        
        if(ELEMENT_DATA_PERFIL_USUARIO.findIndex( f => f.Esquema == _element.id) != -1)
        {
          document.getElementById(_element.id)?.classList.remove("NoVisible");
        }
      }
      else
      {

        
        if(ELEMENT_DATA_PERFIL_USUARIO.findIndex( f => f.Link == _element.id) != -1)
        {
          
          document.getElementById(_element.id)?.classList.remove("NoVisible");
        }

      }
     

      
    }
    


  }
 
  ngOnInit(): void {

    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });

    if(this.loginserv.isLoguin) this.loginserv.TimeOut();

    this.loginserv.change.subscribe(s => {

      this.NomUsuario = this.loginserv.Nombre;

      this.Perfiles();
    });



  }



}
